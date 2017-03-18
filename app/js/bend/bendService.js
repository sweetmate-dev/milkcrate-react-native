import * as Bend from './bend'

var appKey = '57c99bb24bad3035c82b3528';
var appSecret = 'HKxfLQZQ8fAdVJLZ7rCMVVwhpJB8RUtstS0rQfYx';

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
            function () {
                cb(null);
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
        Bend.User.signup(userData).then((ret)=>{
            cb(null, ret);
        }, (err)=>{
            cb(err);
        })
    },

    /**
     * getActiveUser
     *
     * @returns current logged-in user information
     */
    getActiveUser() {
        return Bend.getActiveUser();
    }
}



