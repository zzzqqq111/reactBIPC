/**
 # @author 贝波（liupengyu@baie.com.cn）
 # @date 2019-06-28 10:04
 # @Description: 自定义表达式
 */

/**
 * 处理原始表达式
 * @param {string} originExpression - 原始表达式
 * @returns {string} 处理后的表达式
 */
export function translateExpression(originExpression = '') {
  // 过滤空格
  // 处理中文符号非必需，主要是为了防止有些人把括号打成中文的，如果表单的title中有处理的符号会有bug，可以直接去掉
  return originExpression
    .replace(/ /g, '')
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/×/g, '*')
    .replace(/÷/g, '/');
}

/**
 * 初始化表达式计算方法
 * @param {object} compareReport - 报表原始数据
 * @param {string} originExpression - 原始表达式
 * @returns {function(*): any}
 */
export function initExpression(compareReport, originExpression) {
  const expression = translateExpression(originExpression);
  const varArr = expression.split(/\(|\)|\+|-|\*|\//g).filter(item => {
    let result = false;
    /* eslint eqeqeq: off */
    if (item && Number(item) != item) {
      // 可能会有纯数字(非table title)的情况
      // item是字符串，所以用!=
      result = true;
    }
    return result;
  });
  const dataObjArr = varArr.map(item => {
    const tableIndex = Number(item.match(/\d+$/) && item.match(/\d+$/)[0]) || 1; // 后端字段从1开始排序，所以默认为1
    const name = item.replace(/\d+$/, '');
    return {
      tableIndex, // 表index
      name, // name
    };
  });

  /**
   * 计算值
   * @param {number} rows - 行数
   * @param {object} options
   * @param {string} options.format - 返回的值的格式
   * @return {number}
   */
  function getComputedValue(rows, options = {}) {
    let result;
    let translatedExpression = expression;
    const dataArr = dataObjArr.map(a => {
      let key;
      compareReport.compareDataList.some(b => {
        if (a.name === b.name) {
          key = b.tableField;
          return true;
        }
        return false;
      });
      const recordItem = compareReport[`dataCompare${a.tableIndex}`].records[rows];
      return recordItem ? recordItem[key] : 0;
    });

    varArr.forEach((item, index) => {
      if (typeof dataArr[index] === 'number') {
        translatedExpression = translatedExpression.replace(item, dataArr[index]);
      } else {
        translatedExpression = '';
      }
    });

    /* eslint no-eval: off */
    result = eval(translatedExpression);
    result = Math.floor(result * 100) / 100;
    if (options.format === 'percent') {
      result = `${result * 100}%`;
    }
    return result;
  }

  return getComputedValue;
}
