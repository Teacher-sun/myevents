$(function() {
    getUserInfo()
    $('#btnLogout').on('click', function() {
        // alert(44)
        var layer = layui.layer
        layer.confirm('确定要退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 清空本地存储的token 
            localStorage.removeItem('token')
                // 重新跳转到登录页面
            location.href = '/login.html'

            layer.close(index);
        });
    })
})


// 获取用户信息
function getUserInfo() {
    $.ajax({
        url: '/my/userinfo',
        method: 'get',

        success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户信息失败')
                }
                renderAvatar(res.data)
            }
            // 无论成功还是失败  都会执行complete函数
            // complete: function(res) {
            //     // console.log(res);
            //     // 在complete函数中  可以使用res.responseJSON拿到服务器响应回来的数据
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         // 清空token
            //         localStorage.removeItem('token')
            //             // 跳转到登录页面
            //         location.href = '/login.html'

        //     }
        // }
    })
}
// 渲染用户头像的函数
function renderAvatar(user) {
    // 设置用户的名称
    var name = user.nickname || user.username
        // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
        // 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()

    }

}