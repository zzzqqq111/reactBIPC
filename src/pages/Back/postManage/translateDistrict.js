/**
 # @author 贝波（liupengyu@baie.com.cn）
 # @date 2019-05-28 15:42
 # @Description: 地址数据格式转换
 # 原始数据 [{value: '大区1-省份1-城市1'}, {value: '大区1-省份1-城市2'}, {value: '大区1-省份2-城市21'}]
 # 转换后的数据 [{
 #   大区1: [{
 #     省份1: ['城市1'， '城市2']
 #   }, {
 #     省份2: ['城市21']
 #   }],
 # }]
 */

/**
 * 去掉地址数据中的childrenLabels参数
 * @param disArr
 * @returns {*}
 */
const deleteChildrenLabels = disArr => {
  disArr.forEach(item => {
    /* eslint no-param-reassign: off */
    delete item.childrenLabels;
  });
  return disArr;
};

/**
 * 根据key获取所有地址的values
 * @param {string} level1Key - 大区名
 * @param {string} [level2Key] - 省份名
 */
const getAllDiatrictValue = (allDiatrict, level1Key, level2Key) => {
  let level1Value = [];
  let level2Value = [];
  allDiatrict.some(itemLevel1 => {
    if (Object.keys(itemLevel1)[0] === level1Key) {
      level1Value = itemLevel1[level1Key];
      return true;
    }
    return false;
  });
  if (!level2Key) {
    return level1Value;
  }

  level1Value.some(itemLevel2 => {
    if (Object.keys(itemLevel2)[0] === level2Key) {
      level2Value = itemLevel2[level2Key];
      return true;
    }
    return false;
  });
  return level2Value;
};

/**
 * 处理某个大区下城市全部被选中，或者某个省份下城市被选中的情况
 * @param {object[]} disArr - 选中的地址数据
 * @param {object[]} allDiatrict - 全部地址数据
 * @returns {*}
 */
const handleSelectAll = (disArr, allDiatrict) => {
  const newArr = deleteChildrenLabels(disArr);
  newArr.forEach(itemLevel1 => {
    const level1Key = Object.keys(itemLevel1)[0];
    const level1Value = itemLevel1[level1Key];
    const allLevel1Value = getAllDiatrictValue(allDiatrict, level1Key);
    let shouldClearLevel1Value = true;

    level1Value.forEach(itemLevel2 => {
      const level2Key = Object.keys(itemLevel2)[0];
      const level2Value = itemLevel2[level2Key];
      const allLevel2Value = getAllDiatrictValue(allDiatrict, level1Key, level2Key);
      if (level2Value.length >= allLevel2Value.length) {
        // 如果省份下的所有城市都被选中了，将省份的value改为空数组
        level2Value.splice(0);
      } else {
        shouldClearLevel1Value = false;
      }
    });

    if (level1Value.length >= allLevel1Value.length && shouldClearLevel1Value) {
      // 如果大区下的所有城市都被选中了， 将大区的value改为空数组
      level1Value.splice(0);
    }
  });
  return newArr;
};

/**
 * @todo 1.算法优化 2.兼容多级
 * @param {object[]} disArr - 转换前的地址数组
 * @returns {Array} 转换后的地址数组
 */
const translateDistrict = (disArr = [], allDistrict) => {
  const childrenLabels = [];
  const children = [];
  disArr.forEach(item => {
    const { value } = item;
    const [l1, l2, l3] = value.split('-');
    const l1Index = childrenLabels.indexOf(l1);
    if (l1Index < 0) {
      children.push({
        [l1]: [
          {
            [l2]: [l3],
          },
        ],
      });
      childrenLabels.push(l1);
      children[children.length - 1].childrenLabels = [l2];
    } else {
      const l2Index = children[l1Index].childrenLabels.indexOf(l2);
      if (l2Index < 0) {
        children[l1Index][l1].push({
          [l2]: [l3],
        });
        children[l1Index].childrenLabels.push(l2);
      } else {
        children[l1Index][l1][l2Index][l2].push(l3);
      }
    }
  });
  return handleSelectAll(children, allDistrict);
};

export default translateDistrict;
