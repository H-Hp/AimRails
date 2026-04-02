// DebugWindow.js
//import Phaser from 'phaser'

export default class DebugWindow {
  constructor(scene, forDebugData) {
    //super('GachaScene');
    this.scene = scene;
    console.log("scene:",scene)
    console.log("forDebugData:",forDebugData)
    this.forDebugData=forDebugData

  }

  init() {

    //開発環境以外では何もしない
    //if (this.scene.rails_env !== "development") return;

    //開発環境（development）ならdebugウィンドウを表示
    //開発環境（development）でないなら、さらにuser_idをチェック
    if (this.scene.rails_env !== "development") {
      //ユーザーIDが1でも2でもないなら、リターンで何もしない
      if (this.scene.user_data_json.user_info.user_id !== 1 && this.scene.user_data_json.user_info.user_id !== 2) {
        return;
      }
    }

    this.scene.input.keyboard.on('keydown-D', () => {
      let debug = document.getElementById("debug-window");

      // 現在のシーンキーを取得
      this.currentSceneKey = this.scene.scene.key;
      console.log("this.currentSceneKey:",this.currentSceneKey)



      //トグル処理
      if (debug) {
        debug.style.display = debug.style.display === "none" ? "block" : "none";
        return;
      }

      //HTMLの構築
      const html = `
          <div id="debug-window" style="
            position:fixed;
            top:10px;
            left:10px;
            font-size:8px;
            width:70%;
            height:80%;
            background:rgba(0,0,0,0.75);
            color:white;
            padding:10px;
            z-index:9999;
          ">
            <h3>デバッグ</h3>
          
            <div id="debug-scroll" style="
              height:95%;
              overflow-y:auto;
              padding-right:6px;
            ">
              <div style="background:rgba(255,255,255,0.1); padding:10px; margin-bottom:10px;">
                <label style="display:block; margin:5px 0; cursor:pointer;">
                  <input type="checkbox" id="debug-mode" checked> 
                  開発モード
                </label>
              </div>

              <!--ガチャ-->
              ${this.currentSceneKey === 'GachaScene' 
                ? `<div style="border:1px solid red; padding:5px;">
                    <h4>ガチャ関係</h4>

                    <details open style="margin-bottom:6px;">
                      <summary style="cursor:pointer;">ガチャのシリーズの各データ</summary>
                      <textarea id="edit-gachas_data" style="width:100%; height:150px; background:rgba(0,0,0,0.5); color:#0f0; border:1px solid #444; font-family:monospace; font-size:10px; margin-top:5px;">
                        ${JSON.stringify(this.forDebugData.gachas_data, null, 2)}
                      </textarea>
                    </details>

                    <label style="display:block; margin:5px 0; cursor:pointer;">
                      ガチャid(1が恒常ガチャで、2がピックアップ)
                      <input type="text" id="degug-gacha-id" value="1"> 
                    </label>

                    <button id="create-gacha-config-btn">
                      下のgacha_idでガチャのconfig作成
                    </button>
                    <p>config = GachaConfig.get_config(@gacha_id)</p>

                    <details open style="margin-bottom:6px;">
                      <summary style="cursor:pointer;">Gacha Config</summary>
                      <textarea id="edit-gacha-config" style="width:100%; height:150px; background:rgba(0,0,0,0.5); color:#0f0; border:1px solid #444; font-family:monospace; font-size:10px; margin-top:5px;">
                        [
                          {:rarity=>5, :prob=>0.02, :pickups=>[[20, 0.5]], :ids=>[12, 13, 20, 10]}, 
                          {:rarity=>4, :prob=>0.1, :pickups=>[], :ids=>[7, 6]}, 
                          {:rarity=>3, :prob=>0.88, :pickups=>[], :ids=>[1, 2, 3, 4, 5, 8, 9, 11, 14, 15, 16]}
                        ]
                      </textarea>
                    </details>

                    <button id="gacha1-test-btn">
                      1回回す・下のデータでガチャをテスト
                    </button>
                    <p>@gacha_result=GachaLottery.gacha1(config, user, rval, @gacha_id)</p>
                    
                    <button id="gacha10-test-btn">
                      10回回す・下のデータでガチャをテスト
                    </button>
                    <p>@gacha_result=GachaLottery.gacha10(config, user, rval, @gacha_id)</p>
                    

                    <label style="display:block; margin:5px 0; cursor:pointer;">
                      ユーザーのpickup_ceil_countのピックアップの天井カウント
                      <input type="text" id="degug-gacha-user-pickup_ceil_count" value="0"> 
                    </label>

                    <label style="display:block; margin:5px 0; cursor:pointer;">
                      ユーザーのnew_total_ssr_countの共通天井のカウント
                      <input type="text" id="degug-gacha-user-new_total_ssr_count" value="0"> 
                    </label>

                    <label style="display:block; margin:5px 0; cursor:pointer;">
                      rval・ランダムな値・0.0000...から0.9999...までの完全な乱数で0.002 の場合（超ラッキー！）
                      <input type="text" id="degug-gacha-rval" value="0.002"> 
                    </label>
                  </div>` 
                : ''
              }

              <!--ミッション-->
              ${this.currentSceneKey === 'MissionScene' 
                ? `<div style="border:1px solid red; padding:5px;">
                    <h4>ミッション関係</h4>

                    <button id="update-mission-page-btn">
                      下のデータでミッションページをアップデート
                    </button>

                    <button id="update-user-mission-status-btn">
                      userMissionStatusをモデルデータに変更
                    </button>
                    
                    <details open style="margin-bottom:6px;">
                      <p style="margin-bottom:0px;">ログイン報酬の新しく獲得できる報酬数・newAchiveNum：${this.forDebugData.userMissionStatus.login.newAchiveNum}</p>
                      <p style="margin-bottom:0px;">ログイン報酬のすでに獲得済みの数・alreadyGetted：${this.forDebugData.userMissionStatus.login.alreadyGettedNum}</p>
                      <p style="margin-bottom:0px;">ログイン報酬の未取得のミッションボーナスがあるかのフラグ・YetGettingNewAchiveNum：${this.forDebugData.userMissionStatus.login.YetGettingNewAchiveNum}</p>

                      <p style="margin-bottom:0px;">ガチャ回転の報酬の新しく獲得できる報酬数・newAchiveNum：${this.forDebugData.userMissionStatus.gacha.newAchiveNum}</p>
                      <p style="margin-bottom:0px;">ガチャ回転の報酬のすでに獲得済みの数・alreadyGetted：${this.forDebugData.userMissionStatus.gacha.alreadyGettedNum}</p>
                      <p style="margin-bottom:0px;">ガチャ回転の報酬の未取得のミッションボーナスがあるかのフラグ・YetGettingNewAchiveNum：${this.forDebugData.userMissionStatus.gacha.YetGettingNewAchiveNum}</p>

                      <p style="margin-bottom:0px;">プレイ時間の報酬の新しく獲得できる報酬数・newAchiveNum：${this.forDebugData.userMissionStatus.playtime.newAchiveNum}</p>
                      <p style="margin-bottom:0px;">プレイ時間の報酬のすでに獲得済みの数・alreadyGetted：${this.forDebugData.userMissionStatus.playtime.alreadyGettedNum}</p>
                      <p>プレイ時間の報酬の未取得のミッションボーナスがあるかのフラグ・YetGettingNewAchiveNum：${this.forDebugData.userMissionStatus.playtime.YetGettingNewAchiveNum}</p>

                      <summary style="cursor:pointer;">missions_data</summary>
                      <textarea id="edit-missions_data" style="width:100%; height:150px; background:rgba(0,0,0,0.5); color:#0f0; border:1px solid #444; font-family:monospace; font-size:10px; margin-top:5px;">
                        ${JSON.stringify(this.forDebugData.missions_data, null, 2)}
                      </textarea>
                    </details>

                    <details open style="margin-bottom:6px;">
                      <summary style="cursor:pointer;">userMissionStatus</summary>
                      <textarea id="edit-userMissionStatus" style="width:100%; height:150px; background:rgba(0,0,0,0.5); color:#0f0; border:1px solid #444; font-family:monospace; font-size:10px; margin-top:5px;">
                        ${JSON.stringify(this.forDebugData.userMissionStatus, null, 2)}
                      </textarea>
                    </details>
                  </div>` 
                : ''
              }

              <p>Rails env: ${this.scene.rails_env}</p>
              
              <div style="margin-bottom:8px;">
                ログイン状態:
                <span id="login-state">false</span>
              </div>
              <button id="toggle-login-btn">
                ログインログアウト切り替え
              </button>
              <br>

              <div style="margin-bottom:8px;">
                FPS:0
              </div>

              <p>ゲームサイズwidth・this.scale.width: ${this.scene.scale.width}</p>
              <p>ゲームサイズheight・this.scale.height: ${this.scene.scale.height}</p>

              <p>ブラウザウィンドウのサイズ・window.innerWidth: ${window.innerWidth}</p>
              <p>ブラウザウィンドウのサイズ・window.innerHeight: ${window.innerHeight}</p>

              <div style="background:rgba(255,255,255,0.1); padding:10px; margin-bottom:10px;">
                <label style="display:block; margin:5px 0; cursor:pointer;">
                  <input type="checkbox" id="check-gacha-skip-save" checked> 
                  ガチャを回した後にDBに保存しない・isGachaSkipSave
                </label>
                <label style="display:block; margin:5px 0; cursor:pointer;">
                  <input type="checkbox" id="check-gacha-no-cost" checked> 
                  ガチャを回した後にクリスタルを消費しない・isGachaNoCost
                </label>
              </div>

              <button id="delete-user_data_json-btn">
                user_data_jsonデータの削除
              </button>

              <!-- user_data_json -->
              <details open style="margin-bottom:6px;">
                <summary style="cursor:pointer;">user_data_json</summary>
                <pre id="debug-game" style="white-space:pre-wrap; background:rgba(255,255,255,0.08); padding:6px; color:white ">
                ${JSON.stringify(this.scene.user_data_json, null, 2)}
                </pre>
              </details>

              <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
              <p>
              v
              v
              </p>
              <br>
            </div>
          </div>
      `;

      document.body.insertAdjacentHTML("beforeend", html);

      //イベントリスナーの設定
      document.getElementById("toggle-login-btn").addEventListener("click", () => {
        this.scene.isLoggedIn = !this.scene.isLoggedIn;
        document.getElementById("login-state").textContent = this.scene.isLoggedIn;
        if (this.scene.refreshMenu) this.scene.refreshMenu();
      });

      document.getElementById("delete-user_data_json-btn").addEventListener("click", () => {
        localStorage.removeItem('user_data_json');
        console.log("Storage Deleted");
      });

      //ガチャ
      if(this.currentSceneKey === 'GachaScene' ){
        document.getElementById('create-gacha-config-btn').addEventListener('click', () => {
          console.log("create-gacha-config-btn")
          try {
            const edit_gachas_data = document.getElementById('edit-gachas_data').value;
            const degug_gacha_id = document.getElementById('degug-gacha-id').value;
            const edit_gacha_config = document.getElementById('edit-gacha-config').value;
            console.log("edit_gachas_data:",edit_gachas_data)
            console.log("degug_gacha_id:",degug_gacha_id)
            console.log("edit_gacha_config:",edit_gacha_config)

            fetch('/debug_get_gacha_config', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
              },
              body: JSON.stringify({ gacha_id: degug_gacha_id })
            })
            .then(response => response.json()) // ここでJSONに変換
            .then(config => {
              //const config = response.json();
              console.log("受け取ったGachaConfig:", config);
              document.getElementById('edit-gacha-config').value=JSON.stringify(config, null, 2);//デバッグ用のテキストエリアを更新する      
              //return config;
              //this.scene.updateGachaView(config);//Phaserの画面を更新する
            })
            .catch(error => {
              // エラーが起きた時の処理
              console.error("通信失敗:", error);
            });
          } catch (e) {
            console.error("エラー：", e);
          }
        });

        document.getElementById('gacha1-test-btn').addEventListener('click', () => {
          console.log("gacha1-test-btn")
          try {
            const degug_gacha_user_pickup_ceil_count = document.getElementById('degug-gacha-user-pickup_ceil_count').value;
            const degug_gacha_user_new_total_ssr_count = document.getElementById('degug-gacha-user-new_total_ssr_count').value;
            const degug_gacha_rval = document.getElementById('degug-gacha-rval').value;
            const degug_gacha_id = document.getElementById('degug-gacha-id').value;
            const edit_gacha_config = document.getElementById('edit-gacha-config').value;

            console.log("degug_gacha_user_pickup_ceil_count:",degug_gacha_user_pickup_ceil_count)
            console.log("degug_gacha_user_new_total_ssr_count:",degug_gacha_user_new_total_ssr_count)
            console.log("degug_gacha_rval:",degug_gacha_rval)
            console.log("degug_gacha_id:",degug_gacha_id)

            let debug = document.getElementById("debug-window");
            //トグル処理
            if (debug) {
              debug.style.display = debug.style.display === "none" ? "block" : "none";
              //return;
            }
            //debug.style.display === "none" //デバッグウィンドウを隠す

            this.scene.playGachaAnimation();//ガチャの演出アニメーションと音

            fetch('/debug_gacha1', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
              },
              body: JSON.stringify({ 
                config: edit_gacha_config,
                gacha_id: degug_gacha_id,
                user:{
                  pickup_ceil_count: parseInt(degug_gacha_user_pickup_ceil_count),
                  new_total_ssr_count: parseInt(degug_gacha_user_new_total_ssr_count)
                },
                rval:degug_gacha_rval
              })
            })
            .then(response => response.json()) // ここでJSONに変換
            .then(get_item_data => {
              // ここでRailsからの返り値（config）を受け取る
              //const gacha_result = response.json();
              console.log("受け取ったgacha_result:", get_item_data);

              this.scene.getItemModal(get_item_data);
            }).catch(error => {
              // エラーが起きた時の処理
              console.error("通信失敗:", error);
            });
            //if (!response.ok) throw new Error('Network response was not ok');

          } catch (e) {
            console.error("エラー：", e);
          }
        });

        document.getElementById('gacha10-test-btn').addEventListener('click', () => {
          console.log("gacha10-test-btn")
          try {
            const degug_gacha_user_pickup_ceil_count = document.getElementById('degug-gacha-user-pickup_ceil_count').value;
            const degug_gacha_user_new_total_ssr_count = document.getElementById('degug-gacha-user-new_total_ssr_count').value;
            const degug_gacha_rval = document.getElementById('degug-gacha-rval').value;
            const degug_gacha_id = document.getElementById('degug-gacha-id').value;

            console.log("degug_gacha_user_pickup_ceil_count:",degug_gacha_user_pickup_ceil_count)
            console.log("degug_gacha_user_new_total_ssr_count:",degug_gacha_user_new_total_ssr_count)
            console.log("degug_gacha_rval:",degug_gacha_rval)
            console.log("degug_gacha_id:",degug_gacha_id)

            fetch('/debug_gacha10', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
              },
              body: JSON.stringify({ 
                gacha_id: degug_gacha_id 
              })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            // ここでRailsからの返り値（config）を受け取る
            const gacha_result = response.json();
            console.log("受け取ったgacha_result:", gacha_result);
          } catch (e) {
            console.error("エラー：", e);
          }
        });

        /* 関係あるデータ
        edit-gachas_data
        degug-gacha-id
        create-gacha-config-btn
        edit-gacha-config

        gacha1-test-btn
        gacha10-test-btn
        degug-gacha-user-pickup_ceil_count
        degug-gacha-user-new_total_ssr_count
        degug-gacha-rval
        */
      };

      //ミッション
      if(this.currentSceneKey === 'MissionScene' ){
        //ミッションアップデートボタンクリック時のイベント登録
        const missionUpdateBtn = document.getElementById('update-mission-page-btn');
        missionUpdateBtn.addEventListener('click', () => {
          // データを取得してPhaserシーンに反映するメソッド

          let debug = document.getElementById("debug-window");
          //トグル処理
          if (debug) {
            debug.style.display = debug.style.display === "none" ? "block" : "none";
            //return;
          }

          //this.applyDebugMissionData();
          try {
            //Textareaから文字列を取得
            const missionsDataStr = document.getElementById('edit-missions_data').value;
            const userStatusStr = document.getElementById('edit-userMissionStatus').value;

            //文字列をJSONオブジェクトに変換
            const newMissionsData = JSON.parse(missionsDataStr);
            const newUserStatus = JSON.parse(userStatusStr);

            console.log("デバッグデータを適用します:", { newMissionsData, newUserStatus });

            //Phaserシーン側の変数を上書き
            //this.scene は constructor で受け取った MissionScene のインスタンス
            this.scene.missions_data = newMissionsData;
            this.scene.missionStatus = newUserStatus;

            //シーンの再描画メソッドを呼び出す
            //すでに作成済みのUIを一度消して作り直すのが確実
            if (typeof this.scene.setup_ui_mission === 'function') {
              console.log("setup_ui_missionメソッド・シーンの再描画メソッドを呼び出す");
              // 既存のUIグループやコンテナがあれば消去する処理を setup_ui 内に書くか、ここで destroy する
              this.scene.setup_ui_mission(newUserStatus); 
            }

            //alert("データを反映しました！");

          } catch (e) {
            // JSONの形式が正しくない場合（カンマ忘れ等）にエラーを表示
            console.error("JSONのパースに失敗しました。形式を確認してください。", e);
            alert("エラー: JSONの形式が正しくありません。\n" + e.message);
          }
        });

        //userMissionStatusをモデルデータに変更
        const updateUserMissionStatusBtn = document.getElementById('update-user-mission-status-btn');
        updateUserMissionStatusBtn.addEventListener('click', () => {
          const newUserMissionStatus={
            "login": {
              "newAchiveNum": 5,
              "alreadyGettedNum": 4,
              "YetGettingNewAchiveNum": false
            },"playtime": {
              "newAchiveNum": 3,
              "alreadyGettedNum": 3,
              "YetGettingNewAchiveNum": false
            },"gacha": {
              "newAchiveNum": 2,
              "alreadyGettedNum": 1,
              "YetGettingNewAchiveNum": true
            }
          }
          document.getElementById('edit-userMissionStatus').textContent=JSON.stringify(newUserMissionStatus);



        });
      }
    });
  }
}