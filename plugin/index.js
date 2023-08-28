import path from 'path'
import fs from 'fs'

// 获取src下所有js文件
function getAllJsFilePaths(directoryPath) {
  const jsFilePaths = [];

  const items = fs.readdirSync(directoryPath);

  items.forEach(item => {
    const itemPath = path.join(directoryPath, item);
    const isFile = fs.statSync(itemPath).isFile();
    
    if (isFile && (path.extname(itemPath) === '.js' || path.extname(itemPath) === '.vue')) {
      jsFilePaths.push(itemPath);
    } else if (!isFile) {
      const subJsFilePaths = getAllJsFilePaths(itemPath);
      jsFilePaths.push(...subJsFilePaths);
    }
  });

  return jsFilePaths;
}

export default function(config){
    const usedFiles = new Set()
    return {
        name: 'unused-files-delete',
        moduleParsed(moduleInfo){
            console.log('[moduleParsed]', moduleInfo.id)
            usedFiles.add(moduleInfo.id.replace(/\//g, '\\'))
        },
        buildEnd(){
            console.log('[buildEnd]')
            const srcDirectory = path.resolve(__dirname, '../src');
            const allFiles = getAllJsFilePaths(srcDirectory)
            console.log('[all files]', allFiles)
            const unusedFiles = []
            allFiles.forEach(item => {
                if(!usedFiles.has(item)){
                    console.log('[unused files]', item)
                    unusedFiles.push(item)
                }
            })
            fs.writeFile('./unused-files.txt', unusedFiles.join('\n'), ()=>{})
        }
    }
}