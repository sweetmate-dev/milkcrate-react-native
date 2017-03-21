import * as Bend from './bend'

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
            cb(null, ret);
        }, (err)=> {
            cb(err)
        })
    },
    logout() {
        Bend.User.logout();
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
            console.log("signup ret", ret);
            Bend.setActiveUser(ret.user);
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
    makeBendRef(id, collectionName) {
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



