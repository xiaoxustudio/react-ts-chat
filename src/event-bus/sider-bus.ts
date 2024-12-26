import mitt from 'mitt';
interface SiderButsNames {
    updateSider: undefined | (() => void);
}
type Prop = Record<keyof SiderButsNames, SiderButsNames[keyof SiderButsNames]>;
const siderBus = mitt<Prop>();
export default siderBus;
