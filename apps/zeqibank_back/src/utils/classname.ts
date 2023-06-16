export const classname = (baseClass:string,obj: any) => {
    let result = baseClass;
    for (const key in obj) {
        if (obj[key]) {
            result += ` ${key}` ;
        }
    }
    return result.trim();
}