const express = require("express");
const service = require("./users.service");
const { isObjectIdValid } = require("../db/database.helper");



/**
 * Return all items from database
 * @param {express.Request} req
 * @param {express.Response} res
 */
const findAll = async (_req, res) => {
    const users = await service.findAll().select();
    res.send(users);
  };

  /**
 * Return an item by given ID
 * @param {express.Request} req
 * @param {express.Response} res
 */
const findById = async (req, res) => {
    const id = req.params.id;
  
    if (!isObjectIdValid(id)) {
      return res.status(400).send({ message: "ID inválido!" });
    }
  
    const users = await service.findById(id, '-password')
  
    if (!users) {
      return res.status(404).send({ message: "Usuário não encontrado!" });
    }
  
    res.send(users);
  };

  module.exports = {
    findAll,
    findById,
  };