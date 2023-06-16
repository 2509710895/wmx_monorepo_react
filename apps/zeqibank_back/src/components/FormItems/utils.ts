import { createRegExp } from "../../utils";

// 处理正则rules
export const dealRules = (rules:any[]) => {
    const newRules = rules.map((rule:any) => {
        if (rule.pattern) {
            return {
                ...rule,
                pattern: createRegExp(rule.pattern)
            }
        }
        return rule;
    })
    return newRules;
}