import * as Bend from './bend'
import {
    AsyncStorage
} from 'react-native';
import async from 'async'
import * as _ from 'underscore'

var appKey = '589d36e94bad3014f50128ce';
var appSecret = 'deduKe8DAuA1ry2cYYQXSQEFHgZy9qTvrL0D2lsc';

module.exports = {
    /**
     * init - bend initialize function, must call this function before using bend
     * @param cb - callback(error)
     *             if error is null, then success, else failure to initialize
     */
    init(cb) {
        Bend.init({
            appKey: appKey,
            appSecret: appSecret
        }).then(
            function (activeUser) {
                cb(null, activeUser);
            },
            function (error) {
                cb(error);
            }
        );
    },

    /**
     * login
     *
     * @param username
     * @param password
     * @param cb - callback(error, user),
     *             if login is success, then returns user instance, else returns error
     */
    login(username, password, cb) {
        Bend.User.login({
            username: username,
            password: password
        }).then((ret)=> {
            //this.setUserInfo();
            cb(null, ret);
        }, (err)=> {
            cb(err)
        })
    },
    logout() {
        Bend.User.logout();
        //this.clearUserInfo()
    },
    /**
     * signup
     *
     * @param userData - user information to create
     *                   must include username, password
     * @param cb - callback(error, user)
     *             if success, then returns created user instance, else return error
     *             created user is altivated already, so can logged in automatically
     */
    signup(userData, cb) {
        console.log(userData);
        Bend.executeAnonymous("signup", userData).then((ret)=>{
            //console.log("signup ret", ret);
            Bend.setActiveUser(ret.user);
            //this.setUserInfo();
            cb(null, ret);
        }, (err)=>{
            cb(err);
        })
    },

    updateUser(userData, cb) {
        if(userData.avatar) {
            userData.avatar = this.makeBendFile(userData.avatar._id)
        }
        if(userData.community) {
            userData.community = this.makeBendRef("community", userData.community._id)
        }
        if(userData.coverImage) {
            userData.coverImage = this.makeBendFile(userData.coverImage._id)
        }
        Bend.User.update(userData).then((ret)=> {
            cb(null, ret);
        }, (err)=> {
            cb(err)
        })
    },

    /**
     * getActiveUser
     *
     * @returns current logged-in user information
     */
    getActiveUser() {
        return Bend.getActiveUser();
    },

    getUser(userId, cb) {
        Bend.User.get(userId, {
            relations:{
                avatar:"BendFile",
                community:"community",
                coverImage:"BendFile",
            }
        }).then((ret)=>{
            cb(null, ret)
        }, (err)=>{
            cb(err)
        })
    },

    setUserInfo() {
        //get user full information
        this.getUser(this.getActiveUser()._id, (err, user)=>{
            if(err) {
                console.log(err);return;
            }

            //save user
            AsyncStorage.setItem('milkcrate-user', JSON.stringify(user));
        })
    },

    getUserInfo() {
        if(!this.getActiveUser())  return null;

        var str = AsyncStorage.getItem('milkcrate-user');
        if(str && str.length > 0) {
            return JSON.parse(str)
        }
    },

    clearUserInfo() {
        AsyncStorage.removeItem('milkcrate-user');
    },

    //get community
    getCommunity(cb) {
        var communityId = this.getActiveUser().community._id;
        if(!communityId) return null

        Bend.DataStore.get("community", communityId).then((ret)=>{
            cb(null, ret)
        }, (err)=>{
            cb(err)
        })
    },

    //-------- start of home apis ---------------

    //get all categories
    getCategories(cb) {
      Bend.DataStore.find("category", new Bend.Query()).then((rets)=>{
          cb(null, rets)
      }, (err)=>{
          cb(err)
      })
    },

    getActivityCategory(cats, activity) {
        if(!activity.categories || activity.categories.length == 0)  return null;
        var exist = _.find(cats, (o)=>{
            return o._id == activity.categories[0]
        })

        if(exist) {
            return exist.slug
        }

        return null
    },

    //get weekly challenges
    getWeeklyChallenges(activityQuery, cb) {
        //get community of current user
        var communityId = this.getActiveUser().community._id;
        if(!communityId) return []

        var query = new Bend.Query();
        query.containsAll("communities", [communityId])
        query.greaterThan("endsAt", Date.now() * 1000000)
        query.lessThan("startsAt", Date.now() * 1000000)

        Bend.DataStore.find("challenge", query, {
            relations:{
                activity:"activity"
            }
        }).then((rets)=>{
            cb(null, rets)
        }, (err)=>{
            cb(err)
        })
    },

    //get currently trending
    getTrending(cb) {
        //get community of current user
        var communityId = this.getActiveUser().community._id;
        if(!communityId) return []

        var query = new Bend.Query();
        query.equalTo("community._id", communityId)
        query.notEqualTo("deleted", true)
        query.equalTo("enabled", true)
        query.limit = 10

        Bend.DataStore.find("business", query, {
            relations:{
                certification:"certification",
                community:"community",
                coverImage:"BendFile"
            }
        }).then((rets)=>{
            //get any 2 items
            var count = rets.length;
            if(count > 2) {
                cb(null, _.sample(rets, 2));
            } else
                cb(null, rets)
        }, (err)=>{
            cb(err)
        })
    },

    //get recent activities
    getRecentActivities(offset, limit, cb) {
        //get community of current user
        var communityId = this.getActiveUser().community._id;
        if(!communityId) return []

        var query = new Bend.Query();
        query.equalTo("community._id", communityId)
        query.notEqualTo("deleted", true)
        query.descending("_bmd.createdAt")
        query.limit(limit)
        query.skip(offset)

        Bend.DataStore.find("activity", query, {
            relations:{
                activity:["action", "business", "event", "volunteer_opportunity", "service"],
                community:"community",
                user:"user",
                "user.avatar":"bendFile"
            }
        }).then((rets)=>{
            cb(null, rets)
        }, (err)=>{
            cb(err)
        })
    },

    //poll
    pollResponse(question, answer, cb) {
        //add new response into poll question response
        Bend.DataStore.save("pollQuestionResponse", {
            answer:this.makeBendRef("pollQuestionAnswer", answer._id),
            question:this.makeBendRef("pollQuestion", question._id),
            user:this.makeBendRef("user", this.getActiveUser()._id)
        }).then((ret)=>{
            //increase response count and percentage
            async.waterfall([
                (callback)=>{
                    //pollQuestion update
                    Bend.DataStore.get("pollQuestion", question._id).then((ret)=>{
                        ret.responseCount++;
                        Bend.DataStore.update("pollQuestion", ret).then((ret)=>{
                            callback(null, ret)
                        }, (err)=>{
                            callback(err)
                        })
                    }, (err)=>{
                        callback(err)
                    })
                },
                (questionRet, callback)=>{
                    //pollQuestionAnswer update
                    Bend.DataStore.get("pollQuestionAnswer", answer._id).then((ret)=>{
                        ret.count++;
                        ret.percentage = ret.count * 100 / questionRet.responseCount
                        Bend.DataStore.update("pollQuestion", ret).then((ret)=>{
                            callback(null, ret)
                        }, (err)=>{
                            callback(err)
                        })
                    }, (err)=>{
                        callback(err)
                    })
                }
            ], (err, ret)=>{
                cb(err, ret)
            })
        }, (err)=>{
            cb(err)
        })
    },

    //get poll question
    getPollQuestion(cb) {
        //check if user answered already today
        var query = new Bend.Query();
        query.equalTo("user._id", this.getActiveUser()._id)

        Bend.DataStore.find("pollQuestionResponse", query, {
            relations:{
                answer:"answer",
                question:"question"
            }
        }).then((rets)=>{
            if(rets.length > 0) {
                //get related answers
                query = new Bend.Query();
                query.equalTo("question._id", rets[0].question._id)
                Bend.DataStore.find("pollQuestionAnswer", query).then((answers)=>{
                    cb(null, rets[0].question, answers, rets[0].answer);
                }, (err)=>{
                    cb(err)
                })
            } else {
                //query
                query = new Bend.Query();
                query.equalTo("enabled", true)
                query.and(new Bend.Query().equalTo("community._id", this.getActiveUser().community._id)
                    .or(new Bend.Query().exists("community", false)));
                Bend.DataStore.find("pollQuestion", query).then((rets)=>{
                    if(rets.length > 0) {
                        //get related answers
                        query = new Bend.Query();
                        query.equalTo("question._id", rets[0]._id)
                        Bend.DataStore.find("pollQuestionAnswer", query).then((answers)=>{
                            cb(null, rets[0], answers, null);
                        }, (err)=>{
                            cb(err)
                        })
                    }
                })
            }
        }, (err)=>{
            cb(err)
        })
    },

    //-------- end of home apis ---------------

    //file upload api
    uploadFile(file, cb){
        file._filename = Date.now() + ""

        var obj = {
            _filename: file.fileName,
            mimeType: "image/jpeg",
            size: file.fileSize,
        };
        console.log(obj);

        Bend.File.upload(file, obj, {"public": true}, (res) => {
            console.log(res);
        }).then((res)=>{
            console.log("Success upload", res._downloadURL)
            cb(null, res);
        }, (error) => {
            console.log("Error upload", error)
            cb(error);
        });
    },
    makeBendRef(collectionName, id) {
        return {
            "_type": "BendRef",
            "_id": id,
            "_collection": collectionName
        }
    },
    makeBendFile(id) {
        return {
            "_type": "BendFile",
            "_id": id
        };
    }
}
