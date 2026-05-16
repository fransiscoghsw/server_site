// utils/parseText.js

const parseText = {
    capitalizeFirst: (text) => {
        if (!text) return "";
        return text.charAt(0).toUpperCase() + text.slice(1);
    },

    capitalizeWords: (text) => {
        if (!text) return "";
        return text.replace(/\b\w/g, (char) => char.toUpperCase());
    },

    toCamelCase: (text) => {
        if (!text) return "";
        return text
            .split(" ")
            .map((word, index) =>
                index === 0
                    ? word.toLowerCase()
                    : word.charAt(0).toUpperCase() + word.slice(1),
            )
            .join("");
    },

    toSnakeCase: (text) => {
        if (!text) return "";
        return text.toLowerCase().replace(/\s+/g, "_");
    },

    toKebabCase: (text) => {
        if (!text) return "";
        return text.toLowerCase().replace(/\s+/g, "-");
    },

    toLowerCase: (text) => {
        if (!text) return "";
        return text.toLowerCase().replace(/\s+/g, "");
    },
};

module.exports = parseText;
