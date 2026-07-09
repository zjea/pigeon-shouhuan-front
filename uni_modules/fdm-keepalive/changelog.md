## 1.0.0（2023-05-19）
import addKeepalive from '../../uni_modules/fdm-keepalive'
在合适的地方调用该函数
addKeepalive();
会检测用户是否将软件退出电池优化 未退出会弹窗提示是否退出
注意 会开启唤醒锁且 唤醒锁只有在软件关闭时才会释放
