exports.formattedDateToDateOnly = (date) => {
    const parseDate = new Date(date);
    return parseDate.toISOString().split("T")[0];
};
