import moment from 'moment'
import * as _ from 'underscore'
import Cache from './Cache'

const categoryButtons = {
    animals:require('../../assets/imgs/category-buttons/animals.png'),
    animals_active:require('../../assets/imgs/category-buttons/animals_active.png'),
    baby:require('../../assets/imgs/category-buttons/baby.png'),
    baby_active:require('../../assets/imgs/category-buttons/baby_active.png'),
    beauty:require('../../assets/imgs/category-buttons/beauty.png'),
    beauty_active:require('../../assets/imgs/category-buttons/beauty_active.png'),
    bicycles:require('../../assets/imgs/category-buttons/bicycles.png'),
    bicycles_active:require('../../assets/imgs/category-buttons/bicycles_active.png'),
    civic:require('../../assets/imgs/category-buttons/civic.png'),
    civic_active:require('../../assets/imgs/category-buttons/civic_active.png'),
    coffee:require('../../assets/imgs/category-buttons/coffee.png'),
    coffee_active:require('../../assets/imgs/category-buttons/coffee_active.png'),
    community:require('../../assets/imgs/category-buttons/community.png'),
    community_active:require('../../assets/imgs/category-buttons/community_active.png'),
    construction:require('../../assets/imgs/category-buttons/construction.png'),
    construction_active:require('../../assets/imgs/category-buttons/construction_active.png'),
    dining:require('../../assets/imgs/category-buttons/dining.png'),
    dining_active:require('../../assets/imgs/category-buttons/dining_active.png'),
    drinks:require('../../assets/imgs/category-buttons/drinks.png'),
    drinks_active:require('../../assets/imgs/category-buttons/drinks_active.png'),
    education:require('../../assets/imgs/category-buttons/education.png'),
    education_active:require('../../assets/imgs/category-buttons/education_active.png'),
    energy:require('../../assets/imgs/category-buttons/energy.png'),
    energy_active:require('../../assets/imgs/category-buttons/energy_active.png'),
    fashion:require('../../assets/imgs/category-buttons/fashion.png'),
    fashion_active:require('../../assets/imgs/category-buttons/fashion_active.png'),
    finance:require('../../assets/imgs/category-buttons/finance.png'),
    finance_active:require('../../assets/imgs/category-buttons/finance_active.png'),
    food:require('../../assets/imgs/category-buttons/food.png'),
    food_active:require('../../assets/imgs/category-buttons/food_active.png'),
    garden:require('../../assets/imgs/category-buttons/garden.png'),
    garden_active:require('../../assets/imgs/category-buttons/garden_active.png'),
    'green-space':require('../../assets/imgs/category-buttons/green-space.png'),
    'green-space_active':require('../../assets/imgs/category-buttons/green-space_active.png'),
    'health-wellness':require('../../assets/imgs/category-buttons/health-wellness.png'),
    'health-wellness_active':require('../../assets/imgs/category-buttons/health-wellness_active.png'),
    'home-office':require('../../assets/imgs/category-buttons/home-office.png'),
    'home-office_active':require('../../assets/imgs/category-buttons/home-office_active.png'),
    'media-communications':require('../../assets/imgs/category-buttons/media-communications.png'),
    'media-communications_active':require('../../assets/imgs/category-buttons/media-communications_active.png'),
    products:require('../../assets/imgs/category-buttons/products.png'),
    products_active:require('../../assets/imgs/category-buttons/products_active.png'),
    services:require('../../assets/imgs/category-buttons/services.png'),
    services_active:require('../../assets/imgs/category-buttons/services_active.png'),
    'special-events':require('../../assets/imgs/category-buttons/special-events.png'),
    'special-events_active':require('../../assets/imgs/category-buttons/special-events_active.png'),
    'tourism-hospitality':require('../../assets/imgs/category-buttons/tourism-hospitality.png'),
    'tourism-hospitality_active':require('../../assets/imgs/category-buttons/tourism-hospitality_active.png'),
    transit:require('../../assets/imgs/category-buttons/transit.png'),
    transit_active:require('../../assets/imgs/category-buttons/transit_active.png'),
    waste:require('../../assets/imgs/category-buttons/waste.png'),
    waste_active:require('../../assets/imgs/category-buttons/waste_active.png'),
}

const categoryStickers = {
    animals:require('../../assets/imgs/category-stickers/animals.png'),
    baby:require('../../assets/imgs/category-stickers/baby.png'),
    beauty:require('../../assets/imgs/category-stickers/beauty.png'),
    bicycles:require('../../assets/imgs/category-stickers/bicycles.png'),
    civic:require('../../assets/imgs/category-stickers/civic.png'),
    coffee:require('../../assets/imgs/category-stickers/coffee.png'),
    community:require('../../assets/imgs/category-stickers/community.png'),
    construction:require('../../assets/imgs/category-stickers/construction.png'),
    dining:require('../../assets/imgs/category-stickers/dining.png'),
    drinks:require('../../assets/imgs/category-stickers/drinks.png'),
    education:require('../../assets/imgs/category-stickers/education.png'),
    energy:require('../../assets/imgs/category-stickers/energy.png'),
    fashion:require('../../assets/imgs/category-stickers/fashion.png'),
    finance:require('../../assets/imgs/category-stickers/finance.png'),
    food:require('../../assets/imgs/category-stickers/food.png'),
    garden:require('../../assets/imgs/category-stickers/garden.png'),
    'green-space':require('../../assets/imgs/category-stickers/green-space.png'),
    'health-wellness':require('../../assets/imgs/category-stickers/health-wellness.png'),
    'home-office':require('../../assets/imgs/category-stickers/home-office.png'),
    'media-communications':require('../../assets/imgs/category-stickers/media-communications.png'),
    products:require('../../assets/imgs/category-stickers/products.png'),
    services:require('../../assets/imgs/category-stickers/services.png'),
    'special-events':require('../../assets/imgs/category-stickers/special-events.png'),
    'tourism-hospitality':require('../../assets/imgs/category-stickers/tourism-hospitality.png'),
    transit:require('../../assets/imgs/category-stickers/transit.png'),
    waste:require('../../assets/imgs/category-stickers/waste.png'),
}

const categoryIcons = {
    animals:require('../../assets/imgs/category-icons/animals.png'),
    baby:require('../../assets/imgs/category-icons/baby.png'),
    beauty:require('../../assets/imgs/category-icons/beauty.png'),
    bicycles:require('../../assets/imgs/category-icons/bicycles.png'),
    civic:require('../../assets/imgs/category-icons/civic.png'),
    coffee:require('../../assets/imgs/category-icons/coffee.png'),
    community:require('../../assets/imgs/category-icons/community.png'),
    construction:require('../../assets/imgs/category-icons/construction.png'),
    dining:require('../../assets/imgs/category-icons/dining.png'),
    drinks:require('../../assets/imgs/category-icons/drinks.png'),
    education:require('../../assets/imgs/category-icons/education.png'),
    energy:require('../../assets/imgs/category-icons/energy.png'),
    fashion:require('../../assets/imgs/category-icons/fashion.png'),
    finance:require('../../assets/imgs/category-icons/finance.png'),
    food:require('../../assets/imgs/category-icons/food.png'),
    garden:require('../../assets/imgs/category-icons/garden.png'),
    'green-space':require('../../assets/imgs/category-icons/green-space.png'),
    'health-wellness':require('../../assets/imgs/category-icons/health-wellness.png'),
    'home-office':require('../../assets/imgs/category-icons/home-office.png'),
    'media-communications':require('../../assets/imgs/category-icons/media-communications.png'),
    products:require('../../assets/imgs/category-icons/products.png'),
    services:require('../../assets/imgs/category-icons/services.png'),
    'special-events':require('../../assets/imgs/category-icons/special-events.png'),
    'tourism-hospitality':require('../../assets/imgs/category-icons/tourism-hospitality.png'),
    transit:require('../../assets/imgs/category-icons/transit.png'),
    waste:require('../../assets/imgs/category-icons/waste.png'),
}


const avatarImages={
    cat:require('../../assets/imgs/avatars/cat.png'),
    corgi:require('../../assets/imgs/avatars/corgi.png'),
    fish:require('../../assets/imgs/avatars/fish.png'),
    frog:require('../../assets/imgs/avatars/frog.png'),
    koala:require('../../assets/imgs/avatars/koala.png'),
    lion:require('../../assets/imgs/avatars/lion.png'),
    otter:require('../../assets/imgs/avatars/otter.png'),
    owl:require('../../assets/imgs/avatars/owl.png'),
    penguin:require('../../assets/imgs/avatars/penguin.png'),
    pig:require('../../assets/imgs/avatars/pig.png'),
    raccoon:require('../../assets/imgs/avatars/raccoon.png'),
    rhino:require('../../assets/imgs/avatars/rhino.png'),
    squirrel:require('../../assets/imgs/avatars/squirrel.png'),
    turtle:require('../../assets/imgs/avatars/turtle.png'),
    whale:require('../../assets/imgs/avatars/whale.png')
}

class UtilService {

    static formatDateWithFormat(ts, formatStr) {
        if(ts == "" || ts == null)
            return "";

        return moment.unix(ts/1000000000).format(formatStr);
    };

    static formatDateWithFormat2(date, formatStr) {
        if(!date) return ""
        return moment(date).format(formatStr);
    };

    static formatSimpleDateTime = function(ts) {
        return moment.unix(ts/1000000000).format("MM-DD h:mm a");
    };

    static getPastDateTime(ts) {
        if (ts == null || ts == "")
            return "";
        var mins = Math.floor((Date.now() / 1000 - ts / 1000000000) / 60);
        if (mins < 0) {
            return "just now";
        } else if (mins < 60) {
            if(mins == 1)
                return mins + " minute ago";
            else
                return mins + " minutes ago";
        } else if (mins < 24 * 60) {
            var hours = Math.floor(mins/60)
            if(hours == 1)
                return hours + " hour ago";
            else
                return hours + " hours ago";
        } else if (mins >= 24 * 60) {
            var days = Math.floor(mins/(24 * 60))
            if(days == 1)
                return days + " day ago";
            else
                return days + " days ago";
        }
    }

    static convertToSlug(Text)
    {
        return Text
            .toLowerCase()
            .replace(/[^\w ]+/g,'')
            .replace(/ +/g,'-')
            ;
    }

    static deg2rad(angle) {
        return (angle * Math.PI / 180);
    }

    static getDistanceFromLatLonInMile(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2-lon1);
        var a =
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in km
        return Number((d/1.6093).toFixed(1));
    }

    static getCategoryButton(catSlug) {
        return categoryButtons[catSlug];
    }

    static getCategorySticker(catSlug) {
        return categoryStickers[catSlug];
    }

    static getCategoryIcon(catSlug) {
        return categoryIcons[catSlug];
    }

    static getSmallImage(file) {
        if(file._file)
            file = file._file;

        if(file._versions) {
            if(file._versions.sm) {
                return file._versions.sm._downloadURL;
            } else
                return file._downloadURL;
        } else {
            return file._downloadURL;
        }
    }

    static getLargeImage(file) {
        if(file._file)
            file = file._file;

        if(file._versions) {
            if(file._versions.lg) {
                return file._versions.lg._downloadURL;
            } else
                return file._downloadURL;
        } else {
            return file._downloadURL;
        }
    }

    static getMiddleImage(file) {
        if(file._file)
            file = file._file;

        if(file._versions) {
            if(file._versions.md) {
                return file._versions.md._downloadURL;
            } else
                return file._downloadURL;
        } else {
            return file._downloadURL;
        }
    }

    static getDefaultAvatar(avatarName) {
        return avatarImages[avatarName]
    }

    static getBackColor(imageObj) {
        if(!imageObj) return 'rgb(255,255,255)';
        var backgroundColor = imageObj._env?'rgb(' + imageObj._env['input-md-average'].r + ','
        + imageObj._env['input-md-average'].g + ','
        + imageObj._env['input-md-average'].b + ')':'rgb(255,255,255)'

        return backgroundColor;
    }
    
    static getPricesString(prices) {
        var p = prices||1;
        var ret = ""
        for(i = 1; i <= p ; i++) {
            ret+='$'
        }
        
        return ret
    }

    static getBusinessDay(day) {
        var temp = day.split("-");
        var ret = []
        _.map(temp, (o)=>{
            ret.push(this.capitalizeFirstLetter(o.toLowerCase()))
        })
        return ret.join("-")
    }

    static capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    static convertWithAMPM(d) {
        if(d == 0) {
            return '12pm'
        } else if(d <= 12) {
            return d + 'am'
        } else {
            return (d-12) + 'pm'
        }
    }

    static getBusinessOpen(open) {
        var ret = []
        if(open) {
            _.map(open, (o)=>{
                ret.push(this.convertWithAMPM(o.from) + '-' + this.convertWithAMPM(o.until))
            })

            return ret.join(", ")
        }

        return "";
    }

    static getEventTime(from, until) {
        return moment(from, 'HH:mm').format('h:mm A') + '-' + moment(until, 'HH:mm').format('h:mm A')
    }

    static getEventTimeByTs(from, until) {
        return moment(new Date(from/1000000), 'HH:mm').format('h:mm A') + '-' + moment(new Date(until/1000000), 'HH:mm').format('h:mm A')
    }

    static getDay(dateStr) {
        return moment(dateStr).format("ddd").toUpperCase()
    }
    static getDayByTs(ts) {
        return moment(new Date(ts/1000000)).format("ddd").toUpperCase()
    }

    static getCityStateString(city, state, postal) {
        var ret = []
        if(city) ret.push(city)
        if(state) ret.push(state)
        if(postal) ret.push(postal)

        return ret.join(", ")
    }

    static isValid(data) {
        if(!data) return false

        if(data == '') return false

        return true
    }

    static isValidURL(data) {
        if(!this.isValid(data)) return false

        if(data == 'http://') return false

        return true
    }

    static getCategoryById(id) {
        return _.find(Cache.categories, (o)=>{
            return o._id == id
        })
    }
}

export default UtilService
