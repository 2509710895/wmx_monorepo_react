// 只取最后一个 promise 返回的结果
export function lastPromise (fn:Function){
    let count = 0;
    return (...args:any[]) => {
        count++;
        const currentCount = count;
        return new Promise((resolve, reject) => {
            fn(...args).then((res:any) => {
                if (currentCount === count) {
                    resolve(res);
                }
            }).catch((err:any) => {
                if (currentCount === count) {
                    reject(err);
                }
            })
        })
    }
}
