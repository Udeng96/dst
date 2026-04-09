export const formatDate = (dateString: string) => {

    if(!dateString || dateString.length < 8) {
        return '-'
    }

    const year = dateString?.substring(0, 4)
    const month = dateString?.substring(4, 6)
    const day = dateString?.substring(6, 8)

    const hour = dateString?.length > 10 ? dateString?.substring(8, 10) : ""
    const minute = dateString?.length > 12 ? dateString?.substring(10, 12) : ""
    const second = dateString?.length > 14 ? dateString?.substring(12, 14) : ""

    return `${year}-${month}-${day} ${hour?hour:''}${minute?":" + minute:''}${second?":" + second:''}`
}

/**
 * yyyyMMddHHMMssSSS
 * @param dateString 17 dateString!
 */
export const parseDate = (dateString: string):Date => {
    return new Date(+dateString?.substring(0, 4), +dateString?.substring(4, 6) - 1, +dateString?.substring(6, 8),
        +dateString?.substring(8, 10), +dateString?.substring(10, 12), +dateString?.substring(12, 14), +dateString?.substring(14, 17))
}

export const zeroPadding = (num: number, length: number = 2): string => {
    return String(num).padStart(length, '0')
}