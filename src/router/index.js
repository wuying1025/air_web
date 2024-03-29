import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'


Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path(.*)',
    component: () => import('@/views/redirect')
  }]
},
{
  path: '/login',
  component: () => import('@/views/login'),
  hidden: true
},
{
  path: '/404',
  component: () => import('@/views/error/404'),
  hidden: true
},
{
  path: '/401',
  component: () => import('@/views/error/401'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  redirect: 'index',
  children: [{
    path: 'index',
    component: () => import('@/views/index'),
    name: '首页',
    meta: {
      title: '首页',
      icon: 'dashboard',
      noCache: true,
      affix: true
    }
  }]
},
{
  path: '/laws',
  component: Layout,
  redirect: 'index',
  children: [{
    path: 'detail',
    component: () => import('@/views/law/detail'),
    name: '落实详情',

  }]
},
{
  path: '/work',
  component: Layout,
  redirect: 'index',
  hidden: true,
  children: [
    {
      path: 'leaderactivity',
      component: () => import('@/views/spwork/activity/leaderDetail'),
      name: '专项活动详情页',
      meta: { title: '专项活动详情页' }
    },
    {
      path: 'activity',
      component: () => import('@/views/spwork/activity/detail'),
      name: '专项活动详情',
      meta: { title: '专项活动详情' }
    },
    {
      // editActivity
      path: 'editActivity',
      component: () => import('@/views/spwork/activity/editActivity'),
      name: '编辑填报活动',
      meta: { title: '编辑填报活动' }
    }, {
      path: 'inspect',
      component: () => import('@/views/spwork/inspect/detail'),
      name: '检查活动详情',
      meta: { title: '检查活动详情' }
    },
    {
      path: 'leaderinspect',
      component: () => import('@/views/spwork/inspect/leaderDetail'),
      name: '检查活动详情页',
      meta: { title: '填报检查活动详情页活动' }
    }
  ]
},
{
  path: '/out',
  component: Layout,
  redirect: 'index',
  hidden: true,
  children: [
    {
      path: 'detail',
      component: () => import('@/views/goout/detail'),
      name: '外来人员详情页',
      meta: { title: '外来人员详情页' }
    },
    {
      path: 'leaderdetail',
      component: () => import('@/views/goout/leaderDetail'),
      name: '外来人员详情',
      meta: { title: '外来人员详情' }
    }, {
      path: 'stationApply',
      component: () => import('@/views/goout/stationApply'),
      name: '驻地人员轮休申请',
      meta: { title: '驻地人员轮休申请' }
    }, {
      path: 'stationApply/:id',
      component: () => import('@/views/goout/stationApply'),
      name: '驻地人员外出修改',
      meta: { title: '驻地人员外出修改' }
    }, {
      path: 'leaveApply',
      component: () => import('@/views/goout/leaveApply'),
      name: '请假外出人员申请',
      meta: { title: '请假外出人员申请' }
    }, {
      path: 'leaveApply/:id',
      component: () => import('@/views/goout/leaveApply'),
      name: '请假外出修改',
      meta: { title: '请假外出修改' }
    }, {
      path: 'vacationApply',
      component: () => import('@/views/goout/vacationApply'),
      name: '休假人员申请',
      meta: { title: '休假人员申请' }
    }, {
      path: 'vacationApply/:id',
      component: () => import('@/views/goout/vacationApply'),
      name: '休假人员申请修改',
      meta: { title: '休假人员申请修改' }
    }
  ]
},
{
  path: '/release',
  component: Layout,
  hidden: true,
  children: [{
    path: 'lawdetail/:id',
    component: () => import('@/views/law/lawDetail'),
    hidden: true,
  }]
},
{
  path: '/user',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [{
    path: 'profile',
    component: () => import('@/views/system/user/profile/index'),
    name: 'Profile',
    meta: {
      title: '个人中心',
      icon: 'user'
    }
  }]
},
{
  path: '/dict',
  component: Layout,
  hidden: true,
  children: [{
    path: 'type/data/:dictId(\\d+)',
    component: () => import('@/views/system/dict/data'),
    name: 'Data',
    meta: {
      title: '字典数据',
      icon: ''
    }
  }]
},
{
  path: '/job',
  component: Layout,
  hidden: true,
  children: [{
    path: 'log',
    component: () => import('@/views/monitor/job/log'),
    name: 'JobLog',
    meta: {
      title: '调度日志'
    }
  }]
},
{
  path: '/gen',
  component: Layout,
  hidden: true,
  children: [{
    path: 'edit',
    component: () => import('@/views/tool/gen/editTable'),
    name: 'GenEdit',
    meta: {
      title: '修改生成配置'
    }
  }]
}, {
  path: '/meetings',
  component: Layout,
  hidden: true,
  children: [{
    path: 'detail',
    component: () => import('@/views/meeting/addList/detail'),
    meta: {
      title: '会议详情',
      icon: 'monitor',
      noCache: true,
      affix: true
    },
  }, {
    path: 'detail',
    component: () => import('@/views/meeting/list/detail'),
    name: 'meeting',
    meta: { title: '会议列表' }
  }, {
    path: 'addRoom',
    component: () => import('@/views/meeting/room/add'),
    name: 'AddRoom',
    meta: { title: '添加会场' }
  }, {
    path: 'addRoom/:id',
    component: () => import('@/views/meeting/room/add'),
    name: 'UpdateRoom',
    meta: { title: '修改会场' }
  }, {
    path: 'detailRoom/:id',
    component: () => import('@/views/meeting/room/detail'),
    name: 'DetailRoom',
    meta: { title: '会场详情' }
  }]
}, {
  path: '/plans',
  component: Layout,
  hidden: true,
  children: [{
    path: 'addWork',
    component: () => import('@/views/plan/add/work'),
    name: 'AddWork',
    meta: {
      title: '创建工作计划'
    }
  }, {
    path: 'addWork/:id',
    component: () => import('@/views/plan/add/work'),
    name: 'EditWork',
    meta: {
      title: '修改工作计划'
    }
  },
  {
    path: 'getDetail/:id',
    component: () => import('@/views/plan/list/detail'),
    name: 'PlanDetail',
    meta: {
      title: '周工作计划详情'
    }
  }
    // {
    //   path: 'addStudy',
    //   component: () => import('@/views/plan/add/study'),
    //   name: 'AddStudy',
    //   meta: {
    //     title: '创建学习计划'
    //   }
    // }
  ]
}, {
  path: '/outsiders',
  component: Layout,
  hidden: true,
  children: [{
    path: 'getOutsiderDetail/:id',
    component: () => import('@/views/outsider/list/detail'),
    name: 'OutsiderDetail',
    meta: {
      title: '外来人员信息详情'
    }
  }, {
    path: 'addOutsider',
    component: () => import('@/views/outsider/add'),
    name: 'AddOutsider',
    meta: {
      title: '外来人员登记'
    }
  }, {
    path: 'addOutsider/:id',
    component: () => import('@/views/outsider/add'),
    name: 'UpdateOutsider',
    meta: {
      title: '修改登记信息'
    }
  }]
}, {
  path: '/questions',
  component: Layout,
  hidden: true,
  children: [{
    path: 'test',
    component: () => import('@/views/questionnaire/add/test'),
    meta: { title: '编辑问卷' },
    hidden: true,
  }, {
    path: 'add',
    component: () => import('@/views/questionnaire/add/index'),
    meta: { title: '创建问卷' },
    hidden: true,
  }, {
    path: 'detailList',
    component: () => import('@/views/questionnaire/addList/detailList'),
    meta: { title: '查看结果' },
    hidden: true,
  }, {
    path: 'testDetail',
    component: () => import('@/views/questionnaire/addList/testDetail'),
    meta: { title: '问卷详情' },
    hidden: true,
  }]
}, {
  path: '/questionnaireLogin',
  component: () => import('@/views/questionnaire/login'),
  hidden: true
}, {
  path: '/diningLogin',
  component: () => import('@/views/dining/login'),
  hidden: true
}, {
  path: '/diningTest',
  component: () => import('@/views/dining/test'),
  hidden: true
}, {
  path: '/questionnaireTest',
  component: () => import('@/views/questionnaire/test'),
  hidden: true
}, {
  path: '/exposure_',
  component: Layout,
  hidden: true,
  children: [{
    path: 'detail/:id',
    component: () => import('@/views/exposure/detail'),
    name: 'exposureDetail',
    meta: {
      title: '文章详情'
    }
  }]
}, {
  path: '/important_',
  component: Layout,
  hidden: true,
  children: [{
    path: 'detail/:id',
    component: () => import('@/views/important/detail'),
    name: 'importantDetail',
    meta: {
      title: '文章详情'
    }
  }]
},
{
  path: '/accident_',
  component: Layout,
  hidden: true,
  children: [{
    path: 'detail/:id',
    component: () => import('@/views/accident/detail'),
    name: 'accidentDetail',
    meta: {
      title: '文章详情'
    }
  }]
},
{
  path: '/driver_',
  component: Layout,
  hidden: true,
  children: [{
    path: 'detail/:id',
    component: () => import('@/views/driver/detail'),
    name: 'driverDetail',
    meta: {
      title: '文章详情'
    }
  }]
}, {
  path: '/learn_',
  component: Layout,
  hidden: true,
  children: [{
    path: 'detail/:id',
    component: () => import('@/views/learn/detail'),
    name: 'learnDetail',
    meta: {
      title: '文章详情'
    }
  }]
}, {
  path: '/dynamic_',
  component: Layout,
  hidden: true,
  children: [{
    path: 'detail/:id',
    component: () => import('@/views/dynamic/detail'),
    name: 'dynamicDetail',
    meta: {
      title: '文章详情'
    }
  }]
}, {
  path: '/examLogin',
  component: () => import('@/views/exam/login'),
  hidden: true
},
{
  path: '/exams',
  component: Layout,
  hidden: true,
  children: [{
    path: 'add',
    component: () => import('@/views/exam/add'),
    // name: '发布考试',
    meta: {
      title: '发布考试',
      icon: 'edit',
    },
    hidden: true
  },
  {
    path: 'detail',
    component: () => import('@/views/exam/examList/detail'),
    name: '详情',
    meta: {
      title: '详情',
      icon: 'build',
    },
    hidden: true
  }, {
    path: 'excises',
    component: () => import('@/views/exam/excises'),
    hidden: true
  },
  {
    path: 'addCate',
    component: () => import('@/views/exam/cate/add'),
    name: 'AddTodayworkCate',
    meta: {
      title: '创建考试分类'
    }
  }, {
    path: 'addCate/:id',
    component: () => import('@/views/exam/cate/add'),
    name: 'UpdateTodayworkCate',
    meta: {
      title: '修改考试分类'
    }
  }, {
    path: 'testDetail',
    component: () => import('@/views/exam/testDetail'),
    meta: { title: '试卷详情' },
    hidden: true,
  }
  ]
},
{
  path: '/examList',
  component: () => import('@/views/exam/examList/index'),
  hidden: true
},

{
  path: '/single',
  component: () => import('@/views/exam/test/single'),
  // // name: '单选题',
  // meta: {
  //   title: '单选题',
  //   icon: 'monitor',
  //   noCache: true
  // },
  hidden: true
},
{
  path: '/analytic',
  component: () => import('@/views/exam/test/analytic'),
  // name: '判断题',
  // meta: {
  //   title: '考试结果',
  //   icon: 'monitor',
  //   noCache: true
  // },
  hidden: true
}, {
  path: '/evaluations',
  component: Layout,
  hidden: true,
  children: [{
    path: 'addSeason',
    component: () => import('@/views/evaluation/addSeason'),
    name: 'addSeason',
    meta: {
      title: '创建季度信息'
    }
  }, {
    path: 'addSeason/:id',
    component: () => import('@/views/evaluation/addSeason'),
    name: 'UpdateSeason',
    meta: {
      title: '修改季度信息'
    }
  }, {
    path: 'seasonDetail/:quanId/:name',
    component: () => import('@/views/evaluation/seasonDetail'),
    name: 'seasonDetail',
    meta: {
      title: '评比信息详情'
    }
  }, {
    path: 'addSub/:quanId',
    component: () => import('@/views/evaluation/addSub'),
    name: 'addSub',
    meta: {
      title: '加减分项'
    }
  }, {
    path: 'itemDetail/:id',
    component: () => import('@/views/evaluation/addSubDetail'),
    name: 'AddSubDetail',
    meta: {
      title: '加减分详情'
    }
  }, {
    path: 'selectTotal/:id/:name',
    component: () => import('@/views/evaluation/selectTotal'),
    name: 'SelectTotal',
    meta: {
      title: '量化评比统计'
    }
  }, {
    path: 'selectTotalDetail/:quanId/:deptId',
    component: () => import('@/views/evaluation/selectTotalDetail'),
    name: 'SelectTotalDetail',
    meta: {
      title: '量化评比详情'
    }
  }]
}, {
  path: '/workuploads',
  component: Layout,
  hidden: true,
  children: [{
    path: 'addUpload',
    component: () => import('@/views/weekplan/uploadAdd'),
    name: 'AddUpload',
    meta: {
      title: '创建周工作安排'
    }
  }]
}, {
  path: '/dutys',
  component: Layout,
  hidden: true,
  children: [{
    path: 'addUpload',
    component: () => import('@/views/duty/uploadAdd'),
    name: 'AddDutyUpload',
    meta: {
      title: '创建周值班表'
    }
  }]
}, {
  path: '/dragontigers',
  component: Layout,
  hidden: true,
  children: [{
    path: 'addCate',
    component: () => import('@/views/dragontiger/cate/add'),
    name: 'AddDragontigerCate',
    meta: {
      title: '创建分类'
    }
  }, {
    path: 'addCate/:id',
    component: () => import('@/views/dragontiger/cate/add'),
    name: 'UpdateDragontigerCate',
    meta: {
      title: '修改分类'
    }
  }, {
    path: 'addDragontiger/:id',
    component: () => import('@/views/dragontiger/add'),
    name: 'UpdateDragontiger',
    meta: {
      title: '修改活动'
    }
  }, {
    path: 'saveScore/:id',
    component: () => import('@/views/dragontiger/saveScore'),
    name: 'SaveScore',
    meta: {
      title: '成绩录入'
    }
  }, {
    path: 'deptScore/:id',
    component: () => import('@/views/dragontiger/deptScore'),
    name: 'DeptScore',
    meta: {
      title: '连队排名'
    }
  }, {
    path: 'totalScore/:id',
    component: () => import('@/views/dragontiger/totalScore'),
    name: 'TotalScore',
    meta: {
      title: '龙虎榜'
    }
  }]
}, {
  path: '/safeUploads',
  component: Layout,
  hidden: true,
  children: [{
    path: 'configSafeUpload/:id',
    component: () => import('@/views/safeUpload/upload/config'),
    name: 'ConfigSafeUpload',
    meta: {
      title: '配置责任图'
    }
  }, {
    path: 'addSafeUpload/',
    component: () => import('@/views/safeUpload/upload/add'),
    name: 'AddSafeUpload',
    meta: {
      title: '创建责任图'
    }
  }, {
    path: 'showSafeUpload/:id',
    component: () => import('@/views/safeUpload/upload/show'),
    name: 'ShowSafeUpload',
    meta: {
      title: '查看责任图'
    }
  },]
}, {
  path: '/dinings',
  component: Layout,
  hidden: true,
  children: [{
    path: 'unitAdd',
    component: () => import('@/views/dining/unitAdd'),
    name: 'DiningUnitAdd',
    meta: {
      title: '创建就餐单位'
    }
  }, {
    path: 'unitAdd/:id',
    component: () => import('@/views/dining/unitAdd'),
    name: 'DiningUnitUpdate',
    meta: {
      title: '修改就餐单位'
    }
  }, {
    path: 'add',
    component: () => import('@/views/dining/naireAdd'),
    meta: { title: '创建问卷' },
    hidden: true,
  }, {
    path: 'questionList',
    component: () => import('@/views/dining/questionList'),
    meta: { title: '编辑问题' },
    hidden: true,
  }, {
    path: 'detailList',
    component: () => import('@/views/dining/detailList'),
    meta: { title: '查看排名' },
    hidden: true,
  }, {
    path: 'testDetail',
    component: () => import('@/views/dining/testDetail'),
    meta: { title: '问卷详情' },
    hidden: true,
  }]
}

]

const router = new Router({
  mode: 'hash', // 去掉url中的#
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})
router.beforeEach((to, from, next) => {
  if (to.path == '/index') {
    store.dispatch('app/closeSideBar', { withoutAnimation: false })
  } else {
    store.dispatch('app/openSideBar', { withoutAnimation: false })
  }
  next()
})

export default router