exports.notifyCraneOperator = async ({ containerNumber, lotCode, type }) => {
  console.log(`📣 Notify Crane Operator: Meet at lot ${lotCode} for ${type} container ${containerNumber}`);
};

exports.notifyDriver = async ({ containerNumber, lotCode }) => {
  console.log(`🚛 Notify Driver: Proceed to assigned lot ${lotCode} for container ${containerNumber}`);
};