module.exports = {
  "helpers": {
    "if_or": function (v1, v2, options) {
      if (v1 || v2) {
        return options.fn(this);
      }

      return options.inverse(this);
    },
    "camelcase": str => {
      const capitalize = str => str.charAt(0).toUpperCase() + str.toLowerCase().slice(1)
      let string = str.toLowerCase().replace(/[^A-Za-z0-9]/g, ' ').split(' ')
                      .reduce((result, word) => result + capitalize(word.toLowerCase()))
      return string.charAt(0).toLowerCase() + string.slice(1)
    }
  },
  "prompts":{
    "name": {
      "type": "string",
      "required": true,
      "message": "项目名称"
    },
    "author": {
      "type": "string",
      "message": "作者"
    }
  },
  "filters": {
    
  },
  "completeMessage": "开始运行你的项目:\n\n  {{^inPlace}}cd {{destDirName}}\n  {{/inPlace}}npm install\n  npm run dev\n\n"
};
