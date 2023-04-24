const {app,BrowserWindow,Menu,ipcMain,Tray,BrowserView,dialog} = require('electron')
const path = require('path');
const fs = require('fs');//导入模块

const isDev = process.env.IS_DEV == "true" ? true : false;

let win;
function createWindow(){
  win = new BrowserWindow({
    width:1000,
    height:600,
    show:false,
    frame:false, //去除边框  创建一个无边框窗口 
    webPreferences: {
      // 开启node
      nodeIntegration: true,
      contextIsolation: false,
      // 开启remote
      enableRemoteModule:true
    }
  })
  win.on('ready-to-show',()=>{
    win.show()
  })
  win.loadURL(
    isDev
      ? 'http://localhost:5173'
      : `file://${path.join(__dirname, '../dist/index.html')}`
  );
  // Open the DevTools.开发者工具
  if (isDev) {
    win.webContents.openDevTools();
  }
}

Menu.setApplicationMenu(null) //不显示菜单
// 菜单
/* const template=[
  {
    label:'开始抽奖',
    click:()=>{
      win.webContents.send('menuAction','/')
    }
  },
  {
    label:'抽奖人员',
    click:()=>{
      win.webContents.send('menuAction','/giftPerson')
    }
  },
  {
    label:'奖项设置',
    click:()=>{
      win.webContents.send('menuAction','/awardsSetting')

      // let dia = dialog.showOpenDialogSync({ properties: ['openFile'] })
      // console.log('奖项设置1211',dia);
      // if(dia){
      //   fs.readFile(dia[0], 'utf8', function (err, data) {
      //     console.log('err',err);
      //     // console.log(123,data);
          
      //     // win.webContents.send('setData',data)
      //     win.webContents.send('setData',JSON.stringify(data))
      //   })
      // }
    }
  },
  {
    label:'中奖名单',
    click:()=>{
      win.webContents.send('menuAction','/winList')
    }
  }
]
const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
 */
app.on('ready',()=>{
  console.log('项目准备启动');
  createWindow()

//   const Bview = new BrowserView()
// win.setBrowserView(Bview)
// Bview.setBounds({ x: 0, y: 0, width: 300, height: 300 })
// // view.webContents.loadFile('../src/views/AwardsSetting.html')
// // view.webContents.loadURL('http://baidu.com')
// Bview.webContents.loadFile('../src/views/AwardsSetting.html')
})

ipcMain.on('actionEvent',(event,data)=>{
  console.log('接收右上角值',data);
  switch (data) {
    case 'min':
      win.minimize() //最小化窗口
      break;
      case 'max':
      win.isMaximized()?win.unmaximize():win.maximize()
      break;
      case 'quit':
      app.quit(); //退出
      break;
    default:
      break;
  }
})

// 导入抽奖人员
ipcMain.on('requestFile',()=>{
   let dir = dialog.showOpenDialogSync({properties:['openDirectory']})
  //  console.log('dir',dir);
   if(dir){
    console.log('文件列表',fs.readdirSync(dir[0]));
     win.webContents.send('imgList',fs.readdirSync(dir[0]))
   /*  const content = fs.readdirSync(dir[0])
    // console.log('content',content);

    console.log('许昌吧v风格和vb是',__dirname,'public');

    const publicFolderPath = path.join(__dirname, 'public');
    console.log('文件夹文件夹',publicFolderPath);
    
    
     content.forEach(item => {
      console.log('item',item);
      
      // // 获取源文件路径和目标路径
      const source = `${dir[0]}`;
      // const dest = `/path/to/destination/folder/${item}`;
      // const dest = `/public/img`;
      const dest =publicFolderPath
      console.log('源文件路径',source);
      console.log('目标路径',dest);
      
      // // 判断当前项是文件夹还是文件
      const isFolder = fs.statSync(source).isDirectory();
      
      // 如果是文件夹，递归复制，否则直接复制文件
      if (isFolder) {
        fs.mkdirSynce(dest);
        readAndCopyFolder(source, dest);
      } else {
        fs.copyFileSync(source, dest);
      }
    });

    //递归方法，用于逐层遍历文件夹并复制
    function readAndCopyFolder(source, dest) {
      const content = fs.readdirSync(source);

      content.forEach(item => {
        const sourcePath = `${source}/${item}`;
        const destPath = `${dest}/${item}`;
        const isFolder = fs.statSync(sourcePath).isDirectory();
      
        if (isFolder) {
          fs.mkdirSync(destPath);
          readAndCopyFolder(sourcePath, destPath);
        } else {
          fs.copyFileSync(sourcePath, destPath);
        }
      });
    }*/
   }
})

  // 应用程序只打开一个
  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) {
    app.quit()
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      win.show();
    })
  }

let tray;
app.whenReady().then(() => {
  if (isDev) {
  // 测试环境
    tray = new Tray(path.join(__dirname, '../public/favicon.ico'))
  }else {
  // 正式环境
    tray = new Tray(path.join(path.join(path.dirname(app.getPath('exe'))), '/resources/public/favicon.ico')) //打包托盘图标失效问题处理
  }

  const contextMenu = Menu.buildFromTemplate([
    { label: '打开', click:async()=>{
      win.show();
    }},
    { label: '退出', click:async()=>{
      app.exit();
    }}
  ])
  tray.setToolTip('抽奖')
  tray.setContextMenu(contextMenu)
})

// 所有窗口关闭的时候
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {//判断是否是mac系统
    app.quit(); //退出
  }
});
