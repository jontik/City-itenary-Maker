"use-strict";
const ResourceManager = require("../i18n");
const Utils = require("./Utils");
const DateUtil = require("./DateUtil");

class Handlers {
    constructor() {
        this.dbHelper = new DBHelper();
        this.patientInfo = new PatientInfo();
        this.documentInfo = new DocumentInfo();
        this.documentUtil = new DocumentUtil();
        this.callInternalService = new CallInternalService();
        this.statusManagementHelper = new StatusManagementHelper();
        this.dateU
this.dateUtil = new DateUtil();
    }

    /**
     * check CGT PHI view auth
     * @param {object} item
     * @returns item.hasPHIAccess
     */
    checkPHIAccess(data) {
        data = Array.isArray(data) ? data : [data];
        data.forEach((each) => {
            each.hasPHIAccess = cds.context.user.is("phi_read_srv");
        });
    }

    
}

module.exports = Handlers;

z=new Handlers();
z.checkPHIAccess();
const cds = require("@sap/cds");
const moment = require("moment");

class DateUtil {
    constructor() {
        this.logger = cds.log(this?.constructor?.name);
    }

    /**
     * Regenerate date fields to avoid inconsistency during display post save
     * @param {Object} req req object
     * @param {Object} subEntity child entity for expiry date and manufacturing date check
     * @param {boolean} harvestDateCheck flag to check if harvest date is to be considered
     */
    afterSaveDateF