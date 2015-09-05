var filter = {
    filter: {
        tableName: "taskqueue",
        keyField: "taskorderno",
        subTables: {
            "attachedobjectid": {
                tableName: "customer",
                keyField: "customerid",
                subTables: {
                    "blockid": {
                        tableName: "block",
                        keyField: "blockid",
                        subTables: {
                            "siteid": {
                                tableName: "site",
                                keyField: "siteid",
                                fieldFilters: [{fieldName: "region", op: 6, value: "beş"}]
                            }
                        }
                    }
                }
            }
        }
    }
}