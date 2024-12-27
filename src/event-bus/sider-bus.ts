import mitt from 'mitt';
export interface SiderButsNames {
    openModalAddState: undefined | { key: string };
    updateSider: undefined;
}
type Prop = Record<keyof SiderButsNames, SiderButsNames[keyof SiderButsNames]>;
const siderBus = mitt<Prop>();
export default siderBus;
