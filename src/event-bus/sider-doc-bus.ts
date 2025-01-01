import mitt from 'mitt';
export interface SiderButsNames {
    updateSider: undefined;
}
type Prop = Record<keyof SiderButsNames, SiderButsNames[keyof SiderButsNames]>;
const sideDocrBus = mitt<Prop>();
export default sideDocrBus;
