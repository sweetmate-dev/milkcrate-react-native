import * as moment from 'moment'

const categoryImages2 = {
    animals:require('../../assets/imgs/categories/animals.png'),
    animals_active:require('../../assets/imgs/categories/animals_active.png'),
    baby:require('../../assets/imgs/categories/baby.png'),
    baby_active:require('../../assets/imgs/categories/baby_active.png'),
    beauty:require('../../assets/imgs/categories/beauty.png'),
    beauty_active:require('../../assets/imgs/categories/beauty_active.png'),
    bicycles:require('../../assets/imgs/categories/bicycles.png'),
    bicycles_active:require('../../assets/imgs/categories/bicycles_active.png'),
    civic:require('../../assets/imgs/categories/civic.png'),
    civic_active:require('../../assets/imgs/categories/civic_active.png'),
    coffee:require('../../assets/imgs/categories/coffee.png'),
    coffee_active:require('../../assets/imgs/categories/coffee_active.png'),
    community:require('../../assets/imgs/categories/community.png'),
    community_active:require('../../assets/imgs/categories/community_active.png'),
    construction:require('../../assets/imgs/categories/construction.png'),
    construction_active:require('../../assets/imgs/categories/construction_active.png'),
    dining:require('../../assets/imgs/categories/dining.png'),
    dining_active:require('../../assets/imgs/categories/dining_active.png'),
    drinks:require('../../assets/imgs/categories/drinks.png'),
    drinks_active:require('../../assets/imgs/categories/drinks_active.png'),
    education:require('../../assets/imgs/categories/education.png'),
    education_active:require('../../assets/imgs/categories/education_active.png'),
    energy:require('../../assets/imgs/categories/energy.png'),
    energy_active:require('../../assets/imgs/categories/energy_active.png'),
    fashion:require('../../assets/imgs/categories/fashion.png'),
    fashion_active:require('../../assets/imgs/categories/fashion_active.png'),
    finance:require('../../assets/imgs/categories/finance.png'),
    finance_active:require('../../assets/imgs/categories/finance_active.png'),
    food:require('../../assets/imgs/categories/food.png'),
    food_active:require('../../assets/imgs/categories/food_active.png'),
    garden:require('../../assets/imgs/categories/garden.png'),
    garden_active:require('../../assets/imgs/categories/garden_active.png'),
    'green-space':require('../../assets/imgs/categories/green-space.png'),
    'green-space_active':require('../../assets/imgs/categories/green-space_active.png'),
    'health-wellness':require('../../assets/imgs/categories/health-wellness.png'),
    'health-wellness_active':require('../../assets/imgs/categories/health-wellness_active.png'),
    'home-office':require('../../assets/imgs/categories/home-office.png'),
    'home-office_active':require('../../assets/imgs/categories/home-office_active.png'),
    'media-communications':require('../../assets/imgs/categories/media-communications.png'),
    'media-communications_active':require('../../assets/imgs/categories/media-communications_active.png'),
    products:require('../../assets/imgs/categories/products.png'),
    products_active:require('../../assets/imgs/categories/products_active.png'),
    services:require('../../assets/imgs/categories/services.png'),
    services_active:require('../../assets/imgs/categories/services_active.png'),
    'special-events':require('../../assets/imgs/categories/special-events.png'),
    'special-events_active':require('../../assets/imgs/categories/special-events_active.png'),
    'tourism-hospitality':require('../../assets/imgs/categories/tourism-hospitality.png'),
    'tourism-hospitality_active':require('../../assets/imgs/categories/tourism-hospitality_active.png'),
    transit:require('../../assets/imgs/categories/transit.png'),
    transit_active:require('../../assets/imgs/categories/transit_active.png'),
    waste:require('../../assets/imgs/categories/waste.png'),
    waste_active:require('../../assets/imgs/categories/waste_active.png'),
}

class UtilService {

    static formatDateWithFormat(ts, formatStr) {
        if(ts == "" || ts == null)
            return "";

        return moment.unix(ts/1000000000).format(formatStr);
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
            return mins + " minutes ago";
        } else if (mins < 24 * 60) {
            return this.formatDateWithFormat(ts, "h:mm a");
        } else {
            return this.formatSimpleDateTime(ts)
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

    static getCategoryImage(catSlug) {
        return categoryImages2[catSlug];
    }
}

export default UtilService