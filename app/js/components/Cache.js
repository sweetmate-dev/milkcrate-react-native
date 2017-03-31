import moment from 'moment'
import * as _ from 'underscore'
import * as async from 'async'

import bendService from '../bend/bendService'

class Cache {
    constructor() {
        this.categories = []
        this.community = {}
        this.cacheMap = {}
    }

    init(cb) {
        async.parallel([
            (callback)=>{
                bendService.getCategories((err, rets)=>{
                    if(!err)
                        this.categories = rets;
                    callback(err, null)
                })
            },
            (callback)=>{
                bendService.getCommunity((err, ret)=>{
                    if(!err)
                        this.community = ret;
                    callback(err, null)
                })
            }
        ], (err, ret)=>{
            cb(err, ret)
        })
    }

    setMapData(key, val) {
        this.cacheMap[key] = val
    }

    getMapData(key) {
        return this.cacheMap[key]
    }
}

export default (new Cache())
