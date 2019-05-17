const formatTime = (date) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const padNumber = (num, n) => {
  var digits = (typeof(num) === "string") ? num : num.toString();
  var len = digits.length;
  while (len < n) {
    num = "0" + num;
    len++;
  }
  return num;
}

// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 5000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
});

var getRandom = () => {
  var sources = "abcdefghzklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-.~!@#$%^&*()_:<>?";
  var letters = "abcdefghzklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var numbers = "0123456789";
  var marks = "-.~!@#$%^&*()_:<>?";
  var range = generateRandom(2, sources);
  var lettval = generateRandom(1, letters);
  var numval = generateRandom(1, numbers);
  // var markval = generateRandom(1, marks);
  return lettval + numval + range;
}

var generateRandom = (length, resource) => {
  length = length || 32;
  var s = "";
  for (var i = 0; i < length; i++) {
    s += resource.charAt(
      Math.ceil(Math.random() * 1000) % resource.length
    );
  }
  return s;
};

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();
  wx.showModal({
    title,
    content: JSON.stringify(content),
    showCancel: false
  })
}
var compare = function(prop) {
  return function(obj1, obj2) {
    var val1 = obj1[prop];
    var val2 = obj2[prop];
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1);
      val2 = Number(val2);
    }
    if (val1 < val2) {
      return -1;
    } else if (val1 > val2) {
      return 1;
    } else {
      return 0;
    }
  }
}
module.exports = {
  formatTime,
  showBusy,
  showSuccess,
  showModel,
  padNumber,
  getRandom,
  compare
}