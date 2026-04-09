/**
 * Database 또는 외부 시스템에 의해 CCTV 아이콘 및 기타 정보를 초기화/재정의icon_gis_cctv_normality_hover.png
 icon_gis_cctv_normality_normal.png
 icon_gis_cctv_normality_selected.png 할 수 있기에,
 * 해당 파일에 임시로 CCTV 표출 정보를 담습니다.
 */

import iconGisCctvWaveHover from "./icon/icon_gis_cctv_01_wave_hover.png";
import iconGisCctvWaveNormal from "./icon/icon_gis_cctv_01_wave_normal.png";
import iconGisCctvWaveActiveHover from "./icon/icon_gis_cctv_01_wave_active_hover.png";
import iconGisCctvWaveActiveNormal from "./icon/icon_gis_cctv_01_wave_active_normal.png";

import iconGisCctvCarHover from "./icon/icon_gis_cctv_02_car_hover.png";
import iconGisCctvCarNormal from "./icon/icon_gis_cctv_02_car_normal.png";
import iconGisCctvCarActiveHover from "./icon/icon_gis_cctv_02_car_active_hover.png";
import iconGisCctvCarActiveNormal from "./icon/icon_gis_cctv_02_car_active_normal.png";

import iconGisCctvChildrenHover from "./icon/icon_gis_cctv_03_children_hover.png";
import iconGisCctvChildrenNormal from "./icon/icon_gis_cctv_03_children_normal.png";
import iconGisCctvChildrenActiveHover from "./icon/icon_gis_cctv_03_children_active_hover.png";
import iconGisCctvChildrenActiveNormal from "./icon/icon_gis_cctv_03_children_active_normal.png";
import IconGisCctvNoLitteringHover from "./icon/icon_gis_cctv_04_noLittering_hover.png";
import IconGisCctvNoLitteringNormal from "./icon/icon_gis_cctv_04_noLittering_normal.png";
import IconGisCctvNoLitteringActiveHover from "./icon/icon_gis_cctv_04_noLittering_active_hover.png";
import IconGisCctvNoLitteringActiveNormal from "./icon/icon_gis_cctv_04_noLittering_active_normal.png";
import iconGisCctvOthersHover from "./icon/icon_gis_cctv_05_others_hover.png";
import iconGisCctvOthersNormal from "./icon/icon_gis_cctv_05_others_normal.png";
import iconGisCctvOthersActiveHover from "./icon/icon_gis_cctv_05_others_active_hover.png";
import iconGisCctvOthersActiveNormal from "./icon/icon_gis_cctv_05_others_active_normal.png";
import iconGisCctvSchoolHover from "./icon/icon_gis_cctv_06_school_hover.png";
import iconGisCctvSchoolNormal from "./icon/icon_gis_cctv_06_school_normal.png";
import iconGisCctvSchoolActiveHover from "./icon/icon_gis_cctv_06_school_active_hover.png";
import iconGisCctvSchoolActiveNormal from "./icon/icon_gis_cctv_06_school_active_normal.png";
import iconGisCctvBellHover from "./icon/icon_gis_cctv_07_bell_hover.png";
import iconGisCctvBellNormal from "./icon/icon_gis_cctv_07_bell_normal.png";
import iconGisCctvBellActiveHover from "./icon/icon_gis_cctv_07_bell_active_hover.png";
import iconGisCctvBellActiveNormal from "./icon/icon_gis_cctv_07_bell_active_normal.png";
import iconGisCctvParkHover from "./icon/icon_gis_cctv_08_park_hover.png";
import iconGisCctvParkNormal from "./icon/icon_gis_cctv_08_park_normal.png";
import iconGisCctvParkActiveHover from "./icon/icon_gis_cctv_08_park_active_hover.png";
import iconGisCctvParkActiveNormal from "./icon/icon_gis_cctv_08_park_active_normal.png";
import iconGisCctvHover from "./icon/icon_gis_cctv_hover.png";
import iconGisCctvNormal from "./icon/icon_gis_cctv_normal.png";
import iconGisCctvActiveHover from "./icon/icon_gis_cctv_active_hover.png";
import iconGisCctvActiveNormal from "./icon/icon_gis_cctv_active_normal.png";
import iconGisCctvClusteringHover from "./icon/icon_gis_cctv_clustering_hover.png";
import iconGisCctvClusteringNormal from "./icon/icon_gis_cctv_clustering_normal.png";
import iconGisCctvClusteringActiveHover from "./icon/icon_gis_cctv_clustering_active_hover.png";
import iconGisCctvClusteringActiveNormal from "./icon/icon_gis_cctv_clustering_active_normal.png";

export enum ECctv{
    cctv =  'cctv',
    cluster = 'cluster',
    cctvWave = '16',
    cctvCar = '12',
    cctvChildren = '20',
    cctvNoLittering = '13',
    cctvOthers = '99',
    cctvSchool = '22',
    cctvBell = '10',
    cctvPark = '23'
}

interface ICctvData {
    id: ECctv,
    name: string,
    hoverIcon: string,
    normalIcon: string,
    activeHoverIcon: string,
    activeNormalIcon: string,
    color: string,
}

export const CctvData: Record<string, ICctvData> = {
    [ECctv.cctv]: {
        id: ECctv.cctv,
        name: 'CCTV',
        normalIcon: iconGisCctvNormal,
        hoverIcon: iconGisCctvHover,
        activeNormalIcon: iconGisCctvActiveNormal,
        activeHoverIcon: iconGisCctvActiveHover,
        color: '#bd12d9'
    },
    [ECctv.cluster]: {
        id: ECctv.cctv,
        name: 'CCTV CLUSTER',
        normalIcon: iconGisCctvClusteringNormal,
        hoverIcon: iconGisCctvClusteringHover,
        activeNormalIcon: iconGisCctvClusteringActiveNormal,
        activeHoverIcon: iconGisCctvClusteringActiveHover,
        color: '#bd12d9'
    },
    [ECctv.cctvWave]: {
        id: ECctv.cctvWave,
        name: '하천감시',
        normalIcon: iconGisCctvWaveNormal,
        hoverIcon: iconGisCctvWaveHover,
        activeNormalIcon: iconGisCctvWaveActiveNormal,
        activeHoverIcon: iconGisCctvWaveActiveHover,
        color: '#397C9D'
    },
    [ECctv.cctvCar]: {
        id: ECctv.cctvCar,
        name: '주정차단속',
        normalIcon: iconGisCctvCarNormal,
        hoverIcon: iconGisCctvCarHover,
        activeNormalIcon: iconGisCctvCarActiveNormal,
        activeHoverIcon: iconGisCctvCarActiveHover,
        color: '#3D88CB',
    },
    [ECctv.cctvChildren]: {
        id: ECctv.cctvChildren,
        name: '어린이지킴이',
        normalIcon: iconGisCctvChildrenNormal,
        hoverIcon: iconGisCctvChildrenHover,
        activeNormalIcon: iconGisCctvChildrenActiveNormal,
        activeHoverIcon: iconGisCctvChildrenActiveHover,
        color: '#E1BF00',
    },
    [ECctv.cctvNoLittering]: {
        id: ECctv.cctvNoLittering,
        name: '쓰레기투기방지',
        normalIcon: IconGisCctvNoLitteringNormal,
        hoverIcon: IconGisCctvNoLitteringHover,
        activeNormalIcon: IconGisCctvNoLitteringActiveNormal,
        activeHoverIcon: IconGisCctvNoLitteringActiveHover,
        color: '#719B48',
    },
    [ECctv.cctvOthers]: {
        id: ECctv.cctvOthers,
        name: '기타',
        normalIcon: iconGisCctvOthersNormal,
        hoverIcon: iconGisCctvOthersHover,
        activeNormalIcon: iconGisCctvOthersActiveNormal,
        activeHoverIcon: iconGisCctvOthersActiveHover,
        color: '#617175',
    },
    [ECctv.cctvSchool]: {
        id: ECctv.cctvSchool,
        name: '학교',
        normalIcon: iconGisCctvSchoolNormal,
        hoverIcon: iconGisCctvSchoolHover,
        activeNormalIcon: iconGisCctvSchoolActiveNormal,
        activeHoverIcon: iconGisCctvSchoolActiveHover,
        color: '#B78047',
    },
    [ECctv.cctvBell]: {
        id: ECctv.cctvBell,
        name: '방범',
        normalIcon: iconGisCctvBellNormal,
        hoverIcon: iconGisCctvBellHover,
        activeNormalIcon: iconGisCctvBellActiveNormal,
        activeHoverIcon: iconGisCctvBellActiveHover,
        color: '#AB3E3E',
    },
    [ECctv.cctvPark]: {
        id: ECctv.cctvPark,
        name: '공원',
        normalIcon: iconGisCctvParkNormal,
        hoverIcon: iconGisCctvParkHover,
        activeNormalIcon: iconGisCctvParkActiveNormal,
        activeHoverIcon: iconGisCctvParkActiveHover,
        color: '#95A73A',
    }
}