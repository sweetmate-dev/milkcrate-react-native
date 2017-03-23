import * as moment from 'moment'


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

    static getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
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
        return d;
    }
}

export default UtilService