export const updateObject = (oldObject, newProps) => {
    return {
        ...oldObject,
        ...newProps
    };
};

export const sorting = (array, field, type) => {
    if (type === 'ASC') array.sort((a, b) => ('' + a[field]).localeCompare(b[field]));
    if (type === 'DESC') array.sort((a, b) => ('' + b[field]).localeCompare(a[field]));
};

export const sortingByType = (array, sortingType) => {
    switch (sortingType) {
        case "byAZ": return sorting(array, 'name', 'ASC');
        case "byDate": return sorting(array, 'date', 'ASC');
        case "byCategory": return sorting(array, 'category', 'ASC');
        case "byPriority": return sorting(array, 'priority', 'ASC');
        default: return array;
    }
};

export const sortingByDiv = (div) => {
    switch (div) {
        case "Overdue": return 0;
        case "Today": return 1;
        case "Tomorrow": return 2;
        case "This week": return 3;
        case "Next week": return 4;
        case "This month": return 5;
        case "Later": return 6;
        default: return 7;
    }
};

export const validationSystem = (rules, value) => {
    let isValid = true;

    // Regex
    const password = /(?=.*[\W])(?=.*[\d])(?=.*[\w])/;
    const email = /(?=.*[~`!#$%^&*()_\-+={}[\]:;"'|<>?,/])/;
    const number = /^\d+$/;

    if (!rules) {
        return true;
    }

    if(rules.required && isValid) {
        isValid = value.trim() !== "";
    }

    if(rules.minLength && isValid) {
        isValid = value.length >= rules.minLength;
    }

    if(rules.maxLength && isValid) {
        isValid = value.length <= rules.maxLength;
    }

    if(rules.password && isValid) {
        isValid = password.test(value);
    }

    if(rules.email && isValid) {
        isValid = !email.test(value);
    }

    if (rules.number && isValid) {
        isValid = number.test(value);
    }

    return isValid;
};