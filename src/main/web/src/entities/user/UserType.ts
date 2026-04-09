export const createTemplateUser = (): User => ({
    userId: '',
    userLoginId: '',
    userName: '',
    cpNo: '',
    email: '',
    departmentId: '',
    departmentName: '',
})

export interface User {
    userId: string
    userLoginId: string
    userName: string
    cpNo: string
    email: string
    departmentId: string
    departmentName: string
}

