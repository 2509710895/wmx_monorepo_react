interface IDayMapper {
    [key: string]: boolean;
}

export const Holiday:IDayMapper = {
    "2023-01-01": true,
    "2023-01-02": true,
    "2023-01-21": true,
    "2023-01-22": true,
    "2023-01-23": true,
    "2023-01-24": true,
    "2023-01-25": true,
    "2023-01-26": true,
    "2023-01-27": true,
    "2023-04-05": true,
    "2023-05-01": true,
    "2023-05-02": true,
    "2023-05-03": true,
    "2023-05-09": true,
    "2023-06-22": true,
    "2023-06-23": true,
    "2023-06-24": true,
    "2023-09-29": true,
    "2023-09-30": true,
    "2023-10-01": true,
    "2023-10-02": true,
    "2023-10-03": true,
    "2023-10-04": true,
    "2023-10-05": true,
    "2023-10-06": true,
};

export const SpecialWorkdays:IDayMapper= {
    "2023-01-28": true,
    "2023-01-29": true,
    "2023-04-23": true,
    "2023-05-06": true,
    "2023-06-25": true,
    "2023-10-07": true,
    "2023-10-08": true,
}