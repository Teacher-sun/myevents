$(function() {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
        // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                // console.log(res)
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })

    }
    // 为添加类别做绑定事件
    var indexAdd = '';
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            title: '添加文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-add').html()
        })

    })


    // 通过代理的形式绑定事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
            // console.log(44);
        $.ajax({
            method: 'post',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                initArtCateList()
                layer.msg('新增分类成功')
                    // 根据索引关闭独赢的弹出层
                layer.close(indexAdd)
            }
        })
    })


    // 通过事件委派的形式  为btn-edit按钮绑定点击事件
    var indexEdit = '';
    $('body').on('click', '.btn-edit', function() {
        // console.log(67);
        indexEdit = layer.open({
            title: '修改文章分类',
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id')
            // console.log(id)
            // 发起请求获取数据
        $.ajax({
            method: "get",
            // Restful 传参  有兼容性
            url: '/my/article/cates/' + id,
            success: function(res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    })


    // 通过代理的形式，为修改分类的表单绑定提交事件
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit)
                initArtCateList()

            }
        })
    })

    // 通过代理的形式  为删除按钮绑定点击事件
    $('body').on('click', '.btn-delete', function() {
        // console.log(4);
        var id = $(this).attr('data-id')
            // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})