$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
            const dt = new Date(date)
            var y = dt.getFullYear()
            var m = padZero(dt.getMonth() + 1)
            var d = padZero(dt.getDate())
            var hh = padZero(dt.getHours())
            var mm = padZero(dt.getMinutes())
            var ss = padZero(dt.getSeconds())
            return y + '-' + m + '-' + d + '   ' + hh + ':' + mm + ':' + ss
        }
        // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }
    initTable()
    initCate()

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
                    // renderPage(total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                    // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                    // 通过layui重新渲染表单区域的结构
                form.render()
            }
        })
    }


    // 为筛选表单绑定提交事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault()
            // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
            // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total)
        // 调用laypage.render()方法来渲染分页的结构

        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换时触发的jump函数
            // 触发jump回调的方式有两种：
            // 1·点击页码的时候会触发jump回调。
            // 2·只要调用了laypage.render()方法，就会触发jump回调。
            jump: function(obj, first) {

                // console.log(obj.curr);
                // 可以通过first的值来判断是通过哪种方式触发的jump回调。
                // 如果first的值为true则是方式2触发的，否则就是方式1触发的
                // console.log(first);
                // 把最新的页码值赋值给q

                q.pagenum = obj.curr;
                q.pagesize = obj.limit;

                // 根据最新的q获取对应的数据列表 并渲染表格
                // initTable()
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 通过代理的形式为编辑按钮添加点击事件
    $('body').on('click', '.btn-edit2', function() {

        var id = $(this).attr('data-id')
            // console.log(id);
            // 发起请求获取数据
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function(res) {
                // console.log(res.data);
                // form.val('form-pub2', res.data)

                // 把对象转成字符串再进行本地存储

                var cont = JSON.stringify(res.data)
                    // console.log(cont);
                localStorage.setItem("title", cont)
                location.href = '/article/art_pub-two.html'
            }
        })
    })


    // 通过代理的形式  为删除按钮绑定点击事件处理函数
    $('body').on('click', '.btn-delete', function() {
        // alert(8)
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
            // 获取文章的id
        var id = $(this).attr('data-id')
            // 询问用户是否要删除
        layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                        // 当数据删除完成后，需要判断当前这一页中是否还有剩余的数据，如果没有剩余的数据了，则让页码值减去1之后，再重新调用initTable方法
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }

            })
            layer.close(index);
        });
    })
})