<div align=center>
  <img width =256 src="https://github.com/JRay9487/Electrical-laboratory-Notebook/assets/65828051/d791f893-5773-4dd9-b2ad-94e0f721e5b8"/>
  <h3>ELIMT</h3>
  <p>開源、簡單，適合各大專院校實驗室使用的電子系統</p>
</div>



## 架構 
  由Express結合React 形成簡易免安裝網頁介面，透過Sqlite儲存基本用戶資訊，並利用Drive API 上傳實驗記錄至雲端硬碟。
  ![project](https://github.com/JRay9487/Electrical-laboratory-Notebook/assets/65828051/987ebe11-90a0-4d03-b816-3cd93b66f3bd)

  利用MUI(Material UI) 介面減低開發難度，並可自行更改喜歡的顯示風格。

  為開發方便使用，目前前後端及資料庫之間的連線是未加密的，建議僅在校園內網內使用。
  


## 功能
  大部分功能尚在開發中，目前先以完成電子實驗紀錄簿為主要開發方向。
  
  - [x] 前後端及資料庫系統架構
  - [x] 網頁內容模組化切換
  - [ ] 程式功能
    - [ ] 個人帳號介面
    - [ ] 常用鏈接
    - [x] 小彩蛋?
    - [ ] 系統設定
    - [ ] 使用者管理
    - [ ] 實驗紀錄簿
      - [x] 實驗記錄上傳
        - [x] 上傳功能
        - [ ] 上傳歷史紀錄
      - [ ] 實驗記錄簽核
        - [x] 簽核功能
        - [ ] 簽核歷史
    


## 下載
  ### 注意事項
  * 本專案在Node.js v18.16.0下開發，其他版本相容性目前尚不知。
  * 第一次使用必須在運行電腦上進行Google 雲端授權驗證。

  ## 已知Bug
  * 在MacOS Sonoma 14.2.1, Safari 17.2.1（19617.1.17.11.12）下， ```@google-cloud/local-auth```可能無法進行本地驗證，建議使用Chrome瀏覽器。


  ### 安裝方法
  1. 下載[Node.js v18.16.0](https://nodejs.org/en)
  2. 如果安裝Node.js 在輸入 ```Node -v```，應會出現版本資訊 
  3. 下載本項目資料至電腦
  4. 使用CLI 進入項目資料夾，並輸入 ```npm run dev-install```，下載所有專案需求模組
  5. 使用 ```npm run dev```，啟動系統
  6. 預設登入帳號密碼皆為admin，可透過此管理帳號新增其他用戶(開發中)，或使用[DB Browser for SQLite](https://sqlitebrowser.org/)，編輯資料庫中的users table
  


