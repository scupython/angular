import { isPresent, isBlank } from 'angular2/src/facade/lang';
import { PromiseWrapper } from 'angular2/src/facade/async';
import { ApplicationRef, ReflectiveInjector, getPlatform, createPlatform, assertPlatform } from 'angular2/core';
import { WORKER_RENDER_APPLICATION } from 'angular2/src/platform/worker_render';
import { WORKER_SCRIPT, WORKER_RENDER_PLATFORM, WORKER_RENDER_PLATFORM_MARKER } from 'angular2/src/platform/worker_render_common';
export { WORKER_SCRIPT, WORKER_RENDER_PLATFORM, initializeGenericWorkerRenderer, WORKER_RENDER_APPLICATION_COMMON } from 'angular2/src/platform/worker_render_common';
export { WORKER_RENDER_APPLICATION, WebWorkerInstance } from 'angular2/src/platform/worker_render';
export { ClientMessageBroker, ClientMessageBrokerFactory, FnArg, UiArguments } from '../src/web_workers/shared/client_message_broker';
export { ReceivedMessage, ServiceMessageBroker, ServiceMessageBrokerFactory } from '../src/web_workers/shared/service_message_broker';
export { PRIMITIVE } from '../src/web_workers/shared/serializer';
export * from '../src/web_workers/shared/message_bus';
/**
 * @deprecated Use WORKER_RENDER_APPLICATION
 */
export const WORKER_RENDER_APP = WORKER_RENDER_APPLICATION;
export { WORKER_RENDER_ROUTER } from 'angular2/src/web_workers/ui/router_providers';
export function workerRenderPlatform() {
    if (isBlank(getPlatform())) {
        createPlatform(ReflectiveInjector.resolveAndCreate(WORKER_RENDER_PLATFORM));
    }
    return assertPlatform(WORKER_RENDER_PLATFORM_MARKER);
}
export function bootstrapRender(workerScriptUri, customProviders) {
    var pf = ReflectiveInjector.resolveAndCreate(WORKER_RENDER_PLATFORM);
    var app = ReflectiveInjector.resolveAndCreate([
        WORKER_RENDER_APPLICATION,
        /* @ts2dart_Provider */ { provide: WORKER_SCRIPT, useValue: workerScriptUri },
        isPresent(customProviders) ? customProviders : []
    ], workerRenderPlatform().injector);
    // Return a promise so that we keep the same semantics as Dart,
    // and we might want to wait for the app side to come up
    // in the future...
    return PromiseWrapper.resolve(app.get(ApplicationRef));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid29ya2VyX3JlbmRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgteTgxYTY0UVcudG1wL2FuZ3VsYXIyL3BsYXRmb3JtL3dvcmtlcl9yZW5kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFDLE1BQU0sMEJBQTBCO09BQ3BELEVBQUMsY0FBYyxFQUFDLE1BQU0sMkJBQTJCO09BQ2pELEVBQ0wsY0FBYyxFQUVkLGtCQUFrQixFQUVsQixXQUFXLEVBQ1gsY0FBYyxFQUNkLGNBQWMsRUFDZixNQUFNLGVBQWU7T0FDZixFQUFDLHlCQUF5QixFQUFDLE1BQU0scUNBQXFDO09BQ3RFLEVBQ0wsYUFBYSxFQUNiLHNCQUFzQixFQUN0Qiw2QkFBNkIsRUFDOUIsTUFBTSw0Q0FBNEM7QUFFbkQsU0FDRSxhQUFhLEVBQ2Isc0JBQXNCLEVBQ3RCLCtCQUErQixFQUMvQixnQ0FBZ0MsUUFDM0IsNENBQTRDLENBQUM7QUFDcEQsU0FBUSx5QkFBeUIsRUFBRSxpQkFBaUIsUUFBTyxxQ0FBcUMsQ0FBQztBQUNqRyxTQUNFLG1CQUFtQixFQUNuQiwwQkFBMEIsRUFDMUIsS0FBSyxFQUNMLFdBQVcsUUFDTixpREFBaUQsQ0FBQztBQUN6RCxTQUNFLGVBQWUsRUFDZixvQkFBb0IsRUFDcEIsMkJBQTJCLFFBQ3RCLGtEQUFrRCxDQUFDO0FBQzFELFNBQVEsU0FBUyxRQUFPLHNDQUFzQyxDQUFDO0FBQy9ELGNBQWMsdUNBQXVDLENBQUM7QUFFdEQ7O0dBRUc7QUFDSCxPQUFPLE1BQU0saUJBQWlCLEdBQUcseUJBQXlCLENBQUM7QUFDM0QsU0FBUSxvQkFBb0IsUUFBTyw4Q0FBOEMsQ0FBQztBQUVsRjtJQUNFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQixjQUFjLENBQUMsa0JBQWtCLENBQUMsZ0JBQWdCLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFDRCxNQUFNLENBQUMsY0FBYyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFDdkQsQ0FBQztBQUVELGdDQUNJLGVBQXVCLEVBQ3ZCLGVBQXdEO0lBQzFELElBQUksRUFBRSxHQUFHLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDckUsSUFBSSxHQUFHLEdBQUcsa0JBQWtCLENBQUMsZ0JBQWdCLENBQ3pDO1FBQ0UseUJBQXlCO1FBQ3pCLHVCQUF1QixDQUFDLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFDO1FBQzNFLFNBQVMsQ0FBQyxlQUFlLENBQUMsR0FBRyxlQUFlLEdBQUcsRUFBRTtLQUNsRCxFQUNELG9CQUFvQixFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDckMsK0RBQStEO0lBQy9ELHdEQUF3RDtJQUN4RCxtQkFBbUI7SUFDbkIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0FBQ3pELENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzUHJlc2VudCwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7UHJvbWlzZVdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvYXN5bmMnO1xuaW1wb3J0IHtcbiAgQXBwbGljYXRpb25SZWYsXG4gIFBsYXRmb3JtUmVmLFxuICBSZWZsZWN0aXZlSW5qZWN0b3IsXG4gIFByb3ZpZGVyLFxuICBnZXRQbGF0Zm9ybSxcbiAgY3JlYXRlUGxhdGZvcm0sXG4gIGFzc2VydFBsYXRmb3JtXG59IGZyb20gJ2FuZ3VsYXIyL2NvcmUnO1xuaW1wb3J0IHtXT1JLRVJfUkVOREVSX0FQUExJQ0FUSU9OfSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vd29ya2VyX3JlbmRlcic7XG5pbXBvcnQge1xuICBXT1JLRVJfU0NSSVBULFxuICBXT1JLRVJfUkVOREVSX1BMQVRGT1JNLFxuICBXT1JLRVJfUkVOREVSX1BMQVRGT1JNX01BUktFUlxufSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vd29ya2VyX3JlbmRlcl9jb21tb24nO1xuXG5leHBvcnQge1xuICBXT1JLRVJfU0NSSVBULFxuICBXT1JLRVJfUkVOREVSX1BMQVRGT1JNLFxuICBpbml0aWFsaXplR2VuZXJpY1dvcmtlclJlbmRlcmVyLFxuICBXT1JLRVJfUkVOREVSX0FQUExJQ0FUSU9OX0NPTU1PTlxufSBmcm9tICdhbmd1bGFyMi9zcmMvcGxhdGZvcm0vd29ya2VyX3JlbmRlcl9jb21tb24nO1xuZXhwb3J0IHtXT1JLRVJfUkVOREVSX0FQUExJQ0FUSU9OLCBXZWJXb3JrZXJJbnN0YW5jZX0gZnJvbSAnYW5ndWxhcjIvc3JjL3BsYXRmb3JtL3dvcmtlcl9yZW5kZXInO1xuZXhwb3J0IHtcbiAgQ2xpZW50TWVzc2FnZUJyb2tlcixcbiAgQ2xpZW50TWVzc2FnZUJyb2tlckZhY3RvcnksXG4gIEZuQXJnLFxuICBVaUFyZ3VtZW50c1xufSBmcm9tICcuLi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL2NsaWVudF9tZXNzYWdlX2Jyb2tlcic7XG5leHBvcnQge1xuICBSZWNlaXZlZE1lc3NhZ2UsXG4gIFNlcnZpY2VNZXNzYWdlQnJva2VyLFxuICBTZXJ2aWNlTWVzc2FnZUJyb2tlckZhY3Rvcnlcbn0gZnJvbSAnLi4vc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9zZXJ2aWNlX21lc3NhZ2VfYnJva2VyJztcbmV4cG9ydCB7UFJJTUlUSVZFfSBmcm9tICcuLi9zcmMvd2ViX3dvcmtlcnMvc2hhcmVkL3NlcmlhbGl6ZXInO1xuZXhwb3J0ICogZnJvbSAnLi4vc3JjL3dlYl93b3JrZXJzL3NoYXJlZC9tZXNzYWdlX2J1cyc7XG5cbi8qKlxuICogQGRlcHJlY2F0ZWQgVXNlIFdPUktFUl9SRU5ERVJfQVBQTElDQVRJT05cbiAqL1xuZXhwb3J0IGNvbnN0IFdPUktFUl9SRU5ERVJfQVBQID0gV09SS0VSX1JFTkRFUl9BUFBMSUNBVElPTjtcbmV4cG9ydCB7V09SS0VSX1JFTkRFUl9ST1VURVJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy93ZWJfd29ya2Vycy91aS9yb3V0ZXJfcHJvdmlkZXJzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHdvcmtlclJlbmRlclBsYXRmb3JtKCk6IFBsYXRmb3JtUmVmIHtcbiAgaWYgKGlzQmxhbmsoZ2V0UGxhdGZvcm0oKSkpIHtcbiAgICBjcmVhdGVQbGF0Zm9ybShSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShXT1JLRVJfUkVOREVSX1BMQVRGT1JNKSk7XG4gIH1cbiAgcmV0dXJuIGFzc2VydFBsYXRmb3JtKFdPUktFUl9SRU5ERVJfUExBVEZPUk1fTUFSS0VSKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJvb3RzdHJhcFJlbmRlcihcbiAgICB3b3JrZXJTY3JpcHRVcmk6IHN0cmluZyxcbiAgICBjdXN0b21Qcm92aWRlcnM/OiBBcnJheTxhbnkgLypUeXBlIHwgUHJvdmlkZXIgfCBhbnlbXSovPik6IFByb21pc2U8QXBwbGljYXRpb25SZWY+IHtcbiAgdmFyIHBmID0gUmVmbGVjdGl2ZUluamVjdG9yLnJlc29sdmVBbmRDcmVhdGUoV09SS0VSX1JFTkRFUl9QTEFURk9STSk7XG4gIHZhciBhcHAgPSBSZWZsZWN0aXZlSW5qZWN0b3IucmVzb2x2ZUFuZENyZWF0ZShcbiAgICAgIFtcbiAgICAgICAgV09SS0VSX1JFTkRFUl9BUFBMSUNBVElPTixcbiAgICAgICAgLyogQHRzMmRhcnRfUHJvdmlkZXIgKi8ge3Byb3ZpZGU6IFdPUktFUl9TQ1JJUFQsIHVzZVZhbHVlOiB3b3JrZXJTY3JpcHRVcml9LFxuICAgICAgICBpc1ByZXNlbnQoY3VzdG9tUHJvdmlkZXJzKSA/IGN1c3RvbVByb3ZpZGVycyA6IFtdXG4gICAgICBdLFxuICAgICAgd29ya2VyUmVuZGVyUGxhdGZvcm0oKS5pbmplY3Rvcik7XG4gIC8vIFJldHVybiBhIHByb21pc2Ugc28gdGhhdCB3ZSBrZWVwIHRoZSBzYW1lIHNlbWFudGljcyBhcyBEYXJ0LFxuICAvLyBhbmQgd2UgbWlnaHQgd2FudCB0byB3YWl0IGZvciB0aGUgYXBwIHNpZGUgdG8gY29tZSB1cFxuICAvLyBpbiB0aGUgZnV0dXJlLi4uXG4gIHJldHVybiBQcm9taXNlV3JhcHBlci5yZXNvbHZlKGFwcC5nZXQoQXBwbGljYXRpb25SZWYpKTtcbn1cbiJdfQ==