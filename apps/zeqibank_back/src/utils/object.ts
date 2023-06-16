export const getKeys = (obj:any) => {
    if(getTypes(obj) !== 'Object') {
        return [];
    }
    return Object.keys(obj);
}

export const getTypes = (obj:any) => {
    return Object.prototype.toString.call(obj).slice(8, -1);
}

