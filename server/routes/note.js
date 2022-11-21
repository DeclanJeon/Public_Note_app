import express from "express";
import pool from "../../public/src/model/database.js";
import bcrypt from "bcrypt";

const note_router = express.Router();

// Employee List
note_router.get("/list", async (req, res, next) => {
    await outputListRecord(req, res);
});

const resultsPerPage = 5;
const data_list = {};

const outputListRecord = async (req, res) => {
    try {
        let sql = "SELECT * FROM work_note";
        const rows = await pool.query(sql);

        // console.log(req.query.page, rows.length);

        // await pageNation(req, res, rows);
        return res.status(200).json({
            success: true,
            notes: rows,
        });

        // if (!req.query.page) {
        //     return res.status(200).json({
        //         success: true,
        //         userList: rows,
        //     });
        // } else {

        // }
    } catch (err) {
        res.status(400).send(err.message);
    }
};

const pageNation = async (req, res, rows) => {
    try {
        const numOfResults = rows.length;
        const numberOfPages = Math.ceil(numOfResults / resultsPerPage);
        let page = req.query.page ? Number(req.query.page) : 1;
        if (page > numberOfPages) {
            res.redirect("/list/?page=" + encodeURIComponent(numberOfPages));
        } else if (page < 1) {
            res.redirect("/list/?page=" + encodeURIComponent("1"));
        }
        // Determine the SQL LIMIT starting number
        const startingLimit = (page - 1) * resultsPerPage;

        let sql = `SELECT * FROM owake LIMIT ${startingLimit}, ${resultsPerPage}`;
        const pageResult = await pool.query(sql);

        // console.log(pageResult);

        let iterator = page - 5 < 1 ? 1 : page - 5;
        let endingLink =
            iterator + 9 <= numberOfPages
                ? iterator + 9
                : page + (numberOfPages - page);
        if (endingLink < page + 4) {
            iterator -= page + 4 - numberOfPages;
        }

        data_list.result = pageResult;
        data_list.page = page;
        data_list.iterator = iterator;
        data_list.endingLink = endingLink;
        data_list.numberOfPages = numberOfPages;

        if (
            req.query.page === "" ||
            req.query.page === undefined ||
            !req.query.page
        ) {
            return res.status(200).json({
                success: 1,
                userList: rows,
            });
        } else {
            return res.status(200).json({
                success: 1,
                data: data_list,
            });
        }
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// Employee Register
note_router.post("/add", async (req, res) => {
    await insertRecord(req, res);
});

const insertRecord = async (req, res) => {
    console.log("Insert Record Access");

    const data = {
        user_id: req.body.user,
        note_title: req.body.title,
        note_description: req.body.description,
        create_at: req.body.date,
    };

    for (let obj in data) {
        if (data[obj] === "") {
            return console.log("The data object has an empty value.");
        }
    }

    try {
        let sql =
            "INSERT INTO work_note SET user_id=?, note_title=?, note_description=?, date_at= now()";
        const result = await pool.query(
            sql,
            [data.user_id, data.note_title, data.note_description],
            (err, results) => {
                if (err) throw err;
            }
        );

        if (result.warningStatus === 0) {
            return res.status(200).json({
                success: 1,
            });
        } else {
            res.status(500).json({
                success: 0,
            });
        }
    } catch (err) {
        console.log("Error : ", err.message);
    }
};

// Employee UserID
note_router.get("/edit/:note_id", async (req, res) => {
    const note_id = req.params.note_id;

    let sql = "SELECT * FROM work_note WHERE note_Id= ?";
    const getInfo = await pool.query(sql, [note_id], (err, result) => {
        if (err) throw err;
    });

    if (!getInfo.length) {
        return res.status(500).json({
            success: 0,
            data: getInfo,
        });
    } else {
        return res.status(200).json({
            success: 1,
            data: getInfo,
        });
    }
});

// Employee Update
note_router.post("/update", async (req, res) => {
    console.log("update Record Access");
    let note_id = req.body.note_id;

    const data = {
        user_id: req.body.user_id,
        note_title: req.body.title,
        note_description: req.body.description,
    };

    for (let obj in data) {
        if (data[obj] === "") {
            return console.log("The data object has an empty value.");
        }
    }

    try {
        let sql = `UPDATE work_note SET user_id = ?, note_title = ?, note_description = ?, date_at = now() WHERE note_id = ${note_id}`;
        const result = await pool.query(
            sql,
            [
                data.user_id,
                data.note_title,
                data.note_description,
                data.date_at,
            ],
            (err, results) => {
                if (err) throw err;
            }
        );

        if (result.warningStatus === 0) {
            return res.status(200).json({
                success: 1,
            });
        } else {
            res.status(500).json({
                success: 0,
            });
        }
    } catch (err) {
        console.log("Error : ", err.message);
    }
});

note_router.post("/delete", async (req, res) => {
    let note_id = req.body.note_id;
    try {
        let sql = "DELETE FROM work_note WHERE note_id=?";
        const result = await pool.query(sql, [note_id], (err, results) => {
            if (err) throw err;
        });

        if (result.warningStatus === 0) {
            return res.status(200).json({
                success: 1,
            });
        } else {
            res.status(500).json({
                success: 0,
            });
        }
    } catch (err) {
        console.log("Error : ", err.message);
    }
});

export default note_router;
