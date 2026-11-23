const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs, makeMemoryCacheProvider } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'lasu-navigator-service',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;
const dataConnectSettings = {
  cacheSettings: {
    cacheProvider: makeMemoryCacheProvider()
  }
};
exports.dataConnectSettings = dataConnectSettings;

const listAllActiveAnnouncementsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAllActiveAnnouncements');
}
listAllActiveAnnouncementsRef.operationName = 'ListAllActiveAnnouncements';
exports.listAllActiveAnnouncementsRef = listAllActiveAnnouncementsRef;

exports.listAllActiveAnnouncements = function listAllActiveAnnouncements(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(listAllActiveAnnouncementsRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const createAdminRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateAdmin');
}
createAdminRef.operationName = 'CreateAdmin';
exports.createAdminRef = createAdminRef;

exports.createAdmin = function createAdmin(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(createAdminRef(dcInstance, inputVars));
}
;

const logMetricEventRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'LogMetricEvent', inputVars);
}
logMetricEventRef.operationName = 'LogMetricEvent';
exports.logMetricEventRef = logMetricEventRef;

exports.logMetricEvent = function logMetricEvent(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(logMetricEventRef(dcInstance, inputVars));
}
;

const getLatestAnalyticsReportRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetLatestAnalyticsReport');
}
getLatestAnalyticsReportRef.operationName = 'GetLatestAnalyticsReport';
exports.getLatestAnalyticsReportRef = getLatestAnalyticsReportRef;

exports.getLatestAnalyticsReport = function getLatestAnalyticsReport(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getLatestAnalyticsReportRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;
