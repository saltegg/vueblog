import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Page1 from '@/components/pages/page1'
import Page2 from '@/components/pages/page2'
import Page3 from '@/components/pages/page3'
import Welcome from '@/components/pages/welcome'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: '',
      component: Main,
      hidden: true
    }, 
    {
      path:'/',
      name:'博客管理',
      component:Main,
      /*redirect:'/pages/welcome',*/
      iconCls:'el-icon-menu',
      leaf:false,
      children: [
        {path:'/pages/page1', component:Page1, name:'添加微博'},
        {path:'/pages/page2', component:Page2, name:'博客列表'},
        {path:'/pages/welcome', component:Welcome, name:'分类管理'}
      ]
    },
    {
      path:'/',
      name:'评论管理',
      component:Main,
      iconCls:'el-icon-star-off',
      leaf:true,
      children:[
        {path:'/pages/page3', component:Page3, name:'评论管理'}
      ]
    },
    {
      path: '/',
      component: Main,
      iconCls:'el-icon-info',
      leaf:true,
      name: '用户管理',
      children: [
        {
          path: '/page/page3',
          name: '用户管理',
          component: Page3
        }
      ]
    }
  ]
})

export default router

