/**
 # @author 贝波（liupengyu@baie.com.cn）
 # @date 2019-05-29 16:43
 # @Description: 初始化选择的地区
 # 原始数据 [{
 #   大区1: [{
 #     省份1: ['城市1'， '城市2']
 #   }, {
 #     省份2: ['城市21']
 #   }],
 # }]
 #
 # 转换后的数据 [{value: '大区1-省份1-城市1'}, {value: '大区1-省份1-城市2'}, {value: '大区1-省份2-城市21'}]
 */

/**
 * 获取某个大区或者省份下的所有城市
 * @param allDistrict
 * @param level1Key
 * @param level2Key
 * @returns {Array}
 */
const getAllCity = (allDistrict, level1Key, level2Key) => {
  let selectLevel1;
  let selectLevel2;
  let allSelect = [];
  allDistrict.some(itemLevel1 => {
    if (Object.keys(itemLevel1)[0] === level1Key) {
      selectLevel1 = itemLevel1[level1Key];
      return true;
    }
    return false;
  });
  if (level2Key) {
    selectLevel1.some(itemLevel2 => {
      if (Object.keys(itemLevel2)[0] === level2Key) {
        selectLevel2 = itemLevel2[level2Key];
        return true;
      }
      return false;
    });
    allSelect = selectLevel2.map(item => {
      return {
        label: item,
        value: `${level1Key}-${level2Key}-${item}`,
      };
    });
  } else {
    selectLevel1.forEach(itemLevel2 => {
      const allCity = getAllCity(allDistrict, level1Key, Object.keys(itemLevel2)[0]);
      allSelect = [...allSelect, ...allCity];
    });
  }
  return allSelect;
};

/**
 * 转换地址格式
 * @param selectArea
 * @param allDistrict
 * @returns {Array}
 */
export default function initLastSelectDistrict(selectArea, allDistrict) {
  let newSelectArea = [];
  let allSelectArea = [];
  try {
    newSelectArea = JSON.parse(selectArea);
  } catch {
    /* eslint no-empty: off */
  }

  newSelectArea.forEach(itemLevel1 => {
    const level1Key = Object.keys(itemLevel1)[0];
    const level1Value = itemLevel1[level1Key];

    if (!level1Value.length) {
      // 如果大区的value为空数组，表示当前大区的所有城市都被选中了
      const allCity = getAllCity(allDistrict, level1Key);
      allSelectArea = [...allSelectArea, ...allCity];
    } else {
      level1Value.forEach(itemLevel2 => {
        const level2Key = Object.keys(itemLevel2)[0];
        const level2Value = itemLevel2[level2Key];
        if (!level2Value.length) {
          // 如果省份的value为空数组，表示当前省份的所有城市都被选中了
          const allCity = getAllCity(allDistrict, level1Key, level2Key);
          allSelectArea = [...allSelectArea, ...allCity];
        } else {
          const allCity = level2Value.map(item => {
            return {
              label: item,
              value: `${level1Key}-${level2Key}-${item}`,
            };
          });
          allSelectArea = [...allSelectArea, ...allCity];
        }
      });
    }
  });

  return allSelectArea;
}
