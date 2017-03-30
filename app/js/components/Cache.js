import moment from 'moment'
import * as _ from 'underscore'
import * as async from 'async'

import bendService from '../bend/bendService'

class Cache {
    constructor() {
        this.categories = []
    }

    init(cb) {
        async.parallel([
            (callback)=>{
                bendService.getCategories((err, rets)=>{
                    if(!err)
                        this.categories = rets;
                    callback(err, null)
                })
            }
        ], (err, ret)=>{
            cb(err, ret)
        })
    }
}

export default (new Cache())
