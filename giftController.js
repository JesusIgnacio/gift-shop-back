const fetch = require('node-fetch')
const fs = require('fs')
const lodash = require('lodash')

const REDIS_PORT = process.env.PORT || 6379;
let REDIS_URL = process.env.REDIS_URL || `redis://127.0.0.1:${REDIS_PORT}`;
var url   = require("url").parse(REDIS_URL);
var redis = require("redis").createClient(url.port, url.hostname);
redis.auth(url.auth.split(":")[1]);

const SIMPLE_API_URL_BASE = process.env.URL_BASE || 'https://simple.ripley.cl/api/v2/products'
let PARTNUMBERS = fs.readFileSync('gifts_partnumber_data.txt', { 'encoding': 'utf8'});

exports.index =  async function(req, res, next) {
  try {
    giftsCatalogCache(res)
    const response =  await fetch(`${SIMPLE_API_URL_BASE}?partNumbers=${PARTNUMBERS}`);
    const data =  await response.json();
    const repos = JSON.stringify(data);
    client.set('gifts', repos, 'EX', 60);
    res.json({
      status: "success",
      message: "Gifts retrieved successfully",
      data: data
    });
  } catch (err) {
    res.json({
      status: 1,
      message: err,
    });
  }
}

exports.view = async function(req, res, next) {
  try {
    const { id } = req.params;
    giftDetailCache(id, res);
    const response = await fetch(`${SIMPLE_API_URL_BASE}/${id}`);
    const data = await response.json();
    const repos = JSON.stringify(data);
    client.set('gift', repos, 'EX', 60);
    res.json({
      status: 0,
      message: "Gift detail retrieved successfully",
      data: data
    });
  } catch (err) {
    res.json({
      status: 1,
      message: err,
    });
  }
}

function giftsCatalogCache(res) {
  client.get('gifts', (err, data) => {
    if (err) throw err
    if (data !== null){
        res.json({
          status: "success",
          message: "Gifts retrieved successfully",
          data: JSON.parse(data)
        });
    }
  })
}

function giftDetailCache(id, res) {
  client.get('gift', (err, data) => {
    if (err) throw err
    if (data !== null){
        gift_detail_data = JSON.parse(data);
        lodash.filter(gift_detail_data, { 'partNumber': id } )
        if (gift_detail_data !== null){
            res.json({
              status: "success",
              message: "Gifts retrieved successfully",
              data: JSON.parse(data)
            });
        }else{
            client.get('gifts', (err, data) => {
            if (err) throw err
                
            if (data !== null){
                gift_detail_data = JSON.parse(data);
                lodash.filter(gift_detail_data, { 'partNumber': id } )
                if (gift_detail_data !== null){
                    res.json({
                      status: "success",
                      message: "Gifts retrieved successfully",
                      data: JSON.parse(data)
                    });
                }       
            }
          })
        }
    }
  })
}