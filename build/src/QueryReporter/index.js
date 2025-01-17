"use strict";
/*
 * @adonisjs/lucid
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryReporter = void 0;
/**
 * Used for reporting queries using the profiler and the event
 * emitter
 */
class QueryReporter {
    constructor(client, debug, data) {
        this.client = client;
        this.debug = debug;
        this.data = data;
        this.eventName = 'db:query';
        this.isReady = false;
    }
    /**
     * Initiate the hrtime when there are one or more query listeners
     */
    initStartTime() {
        if (!this.client.emitter.hasListeners(this.eventName) || !this.debug) {
            return;
        }
        this.startTime = process.hrtime();
    }
    /**
     * Init the profiler action when client has profiler attached
     * to it
     */
    initProfilerAction() {
        if (!this.client.profiler) {
            return;
        }
        this.profilerAction = this.client.profiler.profile(this.eventName, this.data);
    }
    /**
     * Commit the profiler action with optional error
     */
    commitProfilerAction(error) {
        if (!this.profilerAction) {
            return;
        }
        error ? this.profilerAction.end({ error }) : this.profilerAction.end();
    }
    /**
     * Emit the query with duration
     */
    emitQueryEvent(error) {
        if (!this.startTime) {
            return;
        }
        const eventData = { duration: process.hrtime(this.startTime), ...this.data, error };
        this.client.emitter.emit(this.eventName, eventData);
    }
    /**
     * Begin query reporting. Data passed to this method will
     * overwrite the existing data object
     */
    begin(data) {
        this.isReady = true;
        this.data = data || this.data;
        this.initStartTime();
        this.initProfilerAction();
        return this;
    }
    /**
     * End query reporting
     */
    end(error) {
        if (!this.isReady) {
            return;
        }
        this.commitProfilerAction(error);
        this.emitQueryEvent(error);
    }
}
exports.QueryReporter = QueryReporter;
