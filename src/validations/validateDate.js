import moment from "moment";
export const validateDate = (date, name) => {
    if (!moment(date, [moment.ISO_8601, "YYYY-MM-DD HH:mm:ss"], true).isValid()) {
        throw new Error(`Invalid ${name}: Must be a valid date string`);
    }
};