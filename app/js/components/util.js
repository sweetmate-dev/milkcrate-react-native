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
}

export default UtilService