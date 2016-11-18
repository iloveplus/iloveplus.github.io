/**
 * Created by xuhang on 2016/11/16.
 */
var data=[
    {
        label:"C#.NET",blogs:[

        ]
    },
    {
        label:"React",blogs:[

        ]
    },
    {
        label:"Angular2",blogs:[

        ]
    },
    {
        label:"Nodejs",blogs:[

        ]
    },
    {
        label:"Mongodb",blogs:[

        ]
    },
    {
        label:"算法",blogs:[

        ]
    },
    {
        label:"错误笔记",blogs:[

        ]
    },
    {
        label:"优秀文摘",blogs:[
            { title:"移动端动画方案",url:"digest_animation_1.html"},
            { title:"搞定这些疑难杂症，向css3动画说yes",url:"digest_animation_2.html"},
            { title:"animation动画实践",url:"digest_animation_3.html"},
            { title:"移动端动画优化",url:"digest_animation_4.html"},
        ]
    },
    {
        label:"个人随笔",blogs:[

        ]
    }
]

// 添加数组find方法
if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
        'use strict';
        if (this == null) {
            throw new TypeError('Array.prototype.find called on null or undefined');
        }
        if (typeof predicate !== 'function') {
            throw new TypeError('predicate must be a function');
        }
        var list = Object(this);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;

        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
}