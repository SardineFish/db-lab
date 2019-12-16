export function getValueThrough<T = any>(object: any, path: string): T
{
    const paths = path.split(".");
    for (let i = 0; i < paths.length; i++)
    {
        object = object[paths[i]];    
    }
    return object;
}

export function setValueThrough<T = any>(object: any, path: string, value: T)
{
    const paths = path.split(".");
    for (let i = 0; i < paths.length - 1; i++)
    {
        object = object[paths[i]];
    }
    object[paths[paths.length - 1]] = value;
}