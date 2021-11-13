/**
 * promise 形式  chooseAddress
 */
export const chooseAddress = () => {
    return new Promise((resolve, reject) => {
        wx.chooseAddress({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    })
}

/**
 * promise 形式  showModal
 * @param {Object} param0 参数
 * @returns 
 */
export const showModal = ({ content }) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: '提示',
            content: content,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}

/**
 * promise 形式  showToast
 * @param {Object} param0 参数
 * @returns 
 */
export const showToast = ({ title }) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
            title: title,
            icon: 'none',
            mask: true,
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        })
    })
}

/**
 * promise 形式  getUserProfile
 * @param {Object} param0 参数
 * @returns 
 */
export const getUserProfile = ({ desc }) => {
    return new Promise((resolve, reject) => {
        wx.getUserProfile({
            desc: desc, // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                resolve(res);
            },
            fail: (err) => {
                reject(err);
            }
        });
    })
}

/**
 * promise 形式  login
 * @returns 
 */
export const login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            timeout: 10000,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
        });
    })
}

/**
 * promise 形式 requestPayment
 * @param {Object} pay 小程序的微信支付
 * @returns 
 */
export const requestPayment = (pay) => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            ...pay,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => { reject(err); }
        });

    })
}