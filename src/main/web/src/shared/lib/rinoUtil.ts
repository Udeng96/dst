export const getProcStName = (procSt: string) => procSt === "1" ? "발생" :
    procSt === "2" ? "지령" :
        procSt === "3" ? "조치" :
            procSt === "4" ? "해제" :
                procSt === "5" ? "종료" : "-"