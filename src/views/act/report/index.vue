<template>
  <div class="app-container">
    <div class="head-container">
      <div class="page-container">
        <b>活动名称：</b>
        <el-button type="text">
          <router-link :to="{path:'/act/actList'}">
            {{ this.$route.query.actName }}
          </router-link>
        </el-button>
        <b>活动编号：</b>
        <label>{{ this.$route.query.actCode }}</label>
        <b>英文名称 ：</b>
        <label>{{ this.$route.query.secondModuleName }}</label>
      </div>
      <el-tabs
        v-model="subMenu"
        @tab-click="handleClick"
      >
        <el-tab-pane
          v-loading="pvuvLoading"
          v-if="checkPermission(['ADMIN','REPORT_ALL','REPORT_ACT_PVUV'])"
          label="PV/UV"
          name="pvuv"
        >
          <div class="from">
            <el-form
              :inline="true"
              label-width="80px"
              class="demo-form-inline"
            >
              <el-form-item label="选择日期">
                <el-date-picker
                  v-model="formPVUVInline"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd"
                  size="mini"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="success"
                  size="mini"
                  icon="el-icon-search"
                  @click="onPVUVSubmit"
                >查询
                </el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="onPVUVActualSubmit"
                >
                  <svg-icon icon-class="real"/>&nbsp;实时查询
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <ve-line
            :data="chartPVUVData"
            :extend="extend"
            :settings="chartSettings"
            width="77.7vw"
            height="400px"
            style="background-color:white"
          />

          <el-table
            :data="tablePVUVData"
            style="width: 100%"
          >
            <el-table-column type="index"/>
            <el-table-column
              prop="date"
              label="时间段"
            />
            <el-table-column
              prop="pv"
              label="PV"
            />
            <el-table-column
              prop="uv"
              label="UV"
            />
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          v-loading="numberLoading"
          v-if="checkPermission(['ADMIN','REPORT_ALL','REPORT_ACT_GROUP_LIST'])"
          label="参团人数"
          name="first"
        >
          <el-form label-width="160px">
            <el-row style="padding-top:50px;margin:10px;left: -80px;">
              <el-col
                :span="5"
                :offset="1"
              >
                <el-form-item label="真">
                  <countTo
                    ref="countTo1"
                    :start-val="groupNumberStart"
                    :end-val="groupNumberEnd"
                    :duration="3000"
                    class="number"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="7"
                :offset="1"
              >
                <el-form-item label="假">
                  <count-to
                    ref="countTo2"
                    :start-val="extraNumberStart"
                    :end-val="extraNumberEnd"
                    :duration="3000"
                    class="number"
                  />
                </el-form-item>
              </el-col>
              <el-col
                :span="9"
                :offset="1"
              >
                <el-form-item label="总">
                  <count-to
                    ref="countTo3"
                    :start-val="totalNumberStart"
                    :end-val="totalNumberEnd"
                    :duration="3000"
                    class="number"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="11">
                <el-form-item label="需要增加的人数">
                  <el-input-number
                    id="addGroupNumber"
                    :precision="0"
                    v-model="peopleNum"
                    style="width:240px"
                    size="small"
                    name="addGroupNumber"/>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-button
                    v-permission="['ADMIN','REPORT_ALL','REPORT_ACT_GROUP_ADD']"
                    type="primary"
                    icon="el-icon-d-arrow-right"
                    @click="changePeopleNum"
                  >
                    GO
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          v-loading="groupLoading"
          v-if="checkPermission(['ADMIN','REPORT_ALL','REPORT_ACT_CARD_LIST'])"
          label="团打卡数据"
          name="clockCard"
        >
          <el-table
            :data="clockCardTableData"
            class="tab_box"
          >
            <el-table-column
              prop="groupName"
              label="团名称"
            />
            <el-table-column
              prop="count"
              label="打卡人数"
            />
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          v-loading="groupLoading"
          v-if="$route.query.actCode === '202005-category'"
          label="榜单值"
          name="topList"
        >
          <el-form :inline="true" :model="filters">
            <el-form-item>
              <el-select v-model="filters.value1" clearable placeholder="请选择榜单" @change="getRole($event)">
                <el-option
                  v-for="item in select1"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
              <el-select
                v-model="filters.value2"
                :loading="loading"
                filterable
                placeholder="请选折商品"
                @change="getList($event)">
                <el-option
                  v-for="item in select2"
                  :key="item.no"
                  :label="item.name"
                  :value="item.no"/>
              </el-select>
            </el-form-item>
            <el-form-item>
              原榜单值：
              <el-input
                v-model="startBillboardNum"
                type="text"
                disabled
                style="width: 200px;"
              />
              <el-input
                v-model="topListVo.billboardNum"
                type="text"
                placeholder="请输入新增榜单值"
                style="width: 200px;"
                onkeyup="value=value.replace(/[^\d]/g,'')"
              />
              <el-button type="primary" size="medium" @click="addTopList('filters')">添加</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          v-loading="ticketLoading"
          v-if="checkPermission(['ADMIN','REPORT_ALL','REPORT_ACT_TICKET_ADD'])"
          label="单品券人数"
          name="second"
        >
          <el-form label-width="160px">
            <el-row style="padding: 40px;">
              请输入区间：
              <el-input
                v-model="minPrice"
                type="number"
                style="margin-left: 50px;width: 100px;"
                class="ticket"
                size="small"
                @change="changePrice"/>
              --
              <el-input v-model="maxPrice" type="number" style="width: 100px;" class="ticket" @change="changePrice"/>
              <div style="margin-top: 10px">
                <div><span class="min_price">{{ min_price }}</span> 每次增加---
                  <el-input
                    v-model="lowMinNumber"
                    type="number"
                    style="width: 100px;"
                    class="ticket"
                  />
                  ~
                  <el-input
                    v-model="lowMaxNumber"
                    type="number"
                    style="width: 100px;"
                    class="ticket"
                  />
                </div>
                <div style="margin-left: -30px"><span class="min_price">{{ min_price }}</span>-<span class="max_price">{{ max_price }}</span>
                  每次增加---
                  <el-input
                    v-model="midMinNumber"
                    type="number"
                    style="width: 100px;"
                    class="ticket"
                  />
                  ~
                  <el-input
                    v-model="midMaxNumber"
                    type="number"
                    style="width: 100px;"
                    class="ticket"
                  />
                </div>
                <div>> <span class="max_price">{{ max_price }}</span> 每次增加---
                  <el-input
                    v-model="highMinNumber"
                    type="number"
                    style="width: 100px;"
                    class="ticket"
                  />
                  ~
                  <el-input
                    v-model="highMaxNumber"
                    type="number"
                    style="width: 100px;"
                    class="ticket"
                  />
                </div>
              </div>
              <div
                id="ticketSubmit"
                style="margin-top: 10px"
              >
                <el-button
                  v-permission="['ADMIN','REPORT_ALL','REPORT_ACT_TICKET_ADD']"
                  v-loading="ticketLoading"
                  type="primary"
                  icon="el-icon-d-arrow-right"
                  @click="addTicket"
                >
                  GO
                </el-button>
              </div>
            </el-row>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          v-loading="flopLoading"
          v-if="checkPermission(['ADMIN','REPORT_ALL','REPORT_DRAW_ANALYSIS_FLOP'])"
          label="翻牌记录"
          name="flopRecord"
        >
          <div class="from">
            <el-form
              :inline="true"
              label-width="80px"
              class="demo-form-inline"
            >
              <el-form-item label="选择日期">
                <el-date-picker
                  v-model="formInline"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  format="yyyy-MM-dd"
                  size="mini"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  v-permission="['ADMIN','REPORT_ALL','REPORT_DRAW_ANALYSIS_FLOP']"
                  type="success"
                  size="mini"
                  icon="el-icon-search"
                  @click="onSubmit"
                >查询
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <ve-line
            :data="chartData"
            :extend="extend"
            :settings="chartSettings"
            width="77.7vw"
            height="400px"
          />
          <el-table
            :data="tableData"
            style="width: 100%"
          >
            <el-table-column type="index"/>
            <el-table-column
              prop="date"
              label="时间段"
            />
            <el-table-column
              prop="totalNum"
              label="参与人次"
            />
            <el-table-column
              prop="peopleNum"
              label="去重人数"
            />
            <el-table-column
              prop="luckyNum"
              label="中奖人次"
            />
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          v-loading="luckyLoading"
          v-if="checkPermission(['ADMIN','REPORT_ALL','REPORT_DRAW_ANALYSIS_LUCKY'])"
          label="中奖记录"
          name="winningRecord"
        >
          <div class="froms">
            <el-form
              ref="form"
              :inline="true"
              label-width="80px"
              size="small"
              class="demo-form-inline"
            >
              <div>
                <el-form-item label="省份">
                  <el-input
                    v-model="form.province"
                    placeholder="请输入省份"
                  />
                </el-form-item>
                <el-form-item label="城市">
                  <el-input
                    v-model="form.city"
                    placeholder="请输入城市"
                  />
                </el-form-item>
                <!--</div>-->
                <!--<div>-->
                <el-form-item label="商场">
                  <el-input
                    v-model="form.omsCode"
                    placeholder="请输入商场"
                  />
                </el-form-item>
                <el-form-item label="奖池">
                  <template>
                    <el-select
                      v-model="form.mallFlag"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in mallFlagOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </template>
                </el-form-item>
                <el-form-item label="用户手机">
                  <el-input
                    v-model="form.mobile"
                    placeholder="请输入用户手机"
                  />
                </el-form-item>
                <el-form-item label="奖品">
                  <template>
                    <el-select
                      v-model="form.grade"
                      clearable
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="item in gradeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </template>
                </el-form-item>
              </div>
              <el-form-item label="选择时间">
                <el-date-picker
                  v-model="form.time"
                  type="datetimerange"
                  size="small"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  v-permission="['ADMIN','REPORT_ALL','REPORT_DRAW_ANALYSIS_LUCKY']"
                  type="success"
                  size="mini"
                  icon="el-icon-search"
                  @click="setSubmit"
                >查询
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table
            :data="tableData1"
            style="width: 100%"
          >
            <el-table-column type="index"/>
            <el-table-column
              prop="city"
              label="省份"
              width="100px"
            />
            <el-table-column
              prop="province"
              label="城市"
              width="100px"
            />
            <el-table-column
              prop="mallName"
              label="商场"
            />
            <el-table-column
              prop="mobile"
              label="用户手机"
            />
            <el-table-column
              prop="time"
              label="时间"
              width="200px"
            />
            <el-table-column
              prop="mallFlag"
              label="奖池"
            >
              <template slot-scope="scope">
                <p v-if="scope.row.mallFlag">
                  <el-tag type="success">是</el-tag>
                </p>
                <p v-else>
                  <el-tag type="info">否</el-tag>
                </p>
              </template>
            </el-table-column>
            <el-table-column
              prop="gradeName"
              label="奖品"
            />
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          v-loading="signUpLoading"
          v-if="checkPermission(['ADMIN','REPORT_ALL','REPORT_SIGN_UP'])"
          label="留资记录"
          name="signUpRecord"
        >
          <el-form
            ref="signUpForm"
            :inline="true"
            label-width="80px"
            size="small"
            class="demo-form-inline"
          >
            <el-form-item label="姓名">
              <el-input
                v-model="signUpForm.name"
                placeholder="请输入姓名"
              />
            </el-form-item>
            <el-form-item label="用户手机">
              <el-input
                v-model="signUpForm.mobile"
                placeholder="请输入手机号"
              />
            </el-form-item>
            <el-form-item label="商场">
              <el-input
                v-model="signUpForm.mallCondition"
                placeholder="请输入商场"
              />
            </el-form-item>
            <el-form-item label="留资页面">
              <el-select
                v-model="signUpForm.type"
                clearable
                placeholder="请选择 留资页面"
              >
                <el-option
                  v-for="item in signUpTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="环境">
              <el-select
                v-model="signUpForm.cliType"
                clearable
                placeholder="请选择环境"
              >
                <el-option
                  v-for="item in cliTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="scene">
              <el-input
                v-model="signUpForm.scene"
                placeholder="请输入scene"
              />
            </el-form-item>
            <el-form-item label="选择时间">
              <el-date-picker
                v-model="viewTime"
                type="datetimerange"
                size="small"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                v-permission="['ADMIN','REPORT_ALL','REPORT_SIGN_UP']"
                type="success"
                size="mini"
                class="filter-item"
                icon="el-icon-search"
                @click="toQuerySignUpData"
              >查询
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="mini"
                class="filter-item"
                icon="el-icon-download"
                @click="exportSignUp"
              >导出
              </el-button>
            </el-form-item>
          </el-form>
          <el-table
            v-loading="loading"
            :data="data"
            style="width: 100%"
          >
            <el-table-column
              type="index"
              width="50"
            />
            <el-table-column
              prop="mallName"
              label="商场"
              width="150"
            />
            <el-table-column
              prop="type"
              label="留资页面"
              width="150"
            />
            <el-table-column
              prop="updateTime"
              label="时间"
              width="150"
            >
              <template slot-scope="scope">
                {{ dateFormat(new Date(scope.row.updateTime),'yyyy-MM-dd HH:mm:ss') }}
              </template>
            </el-table-column>
            <el-table-column
              prop="cliType"
              label="环境"
              width="150"
            >
              <template slot-scope="scope">
                <el-tag v-if="scope.row.cliType == 1">{{ cliTypeStr[scope.row.cliType] }}</el-tag>
                <el-tag
                  v-if="scope.row.cliType == 2"
                  type="success"
                >{{ cliTypeStr[scope.row.cliType] }}
                </el-tag>
                <el-tag
                  v-if="scope.row.cliType == 3"
                  type="info"
                >{{ cliTypeStr[scope.row.cliType] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="留资信息"
            >
              <template slot-scope="scope">
                <label>姓名：</label>{{ scope.row.name }}<br>
                <label>手机号：</label>{{ scope.row.mobile }}
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="渠道信息"
            >
              <template slot-scope="scope">
                <template v-if="scope.row.scene"><label>scene：</label>{{ scope.row.scene }}<br></template>
                <template v-if="scope.row.fromOpenId"><label>分享人openid：</label>{{ scope.row.fromOpenId }}<br></template>
                <template v-if="scope.row.fromUnionId"><label>分享人unionid：</label>{{ scope.row.fromUnionId }}</template>
                <template v-if="!scope.row.scene && !scope.row.fromOpenId && !scope.row.fromUnionId">无</template>
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <el-pagination
            :total="total"
            :current-page="page + 1"
            style="margin-top: 8px;"
            layout="total, prev, pager, next, sizes"
            @size-change="sizeChange"
            @current-change="pageChange"
          />
        </el-tab-pane>
        <el-tab-pane
          v-if="checkPermission(['ADMIN','REPORT_ALL','REPORT_ACT_BTN_DAILY'])"
          label="每日按钮点击记录"
          name="btnReportDaily"
        >
          <div class="froms">
            <el-form
              ref="form"
              :inline="true"
              label-width="80px"
              size="small"
              class="demo-form-inline"
            >
              <div>
                <el-form-item label="模块">
                  <treeselect
                    :show-count="true"
                    :options="dictTree"
                    :multiple="true"
                    :max-height="150"
                    no-options-text="选项为空"
                    search-nested
                    style="width: 560px;"
                    placeholder="选择模块"
                    @input="dictSelect"
                  />
                </el-form-item>
                <!--</div>-->
                <!--<div>-->
                <el-form-item label="选择日期">
                  <el-date-picker
                    v-model="dictDate"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    format="yyyy-MM-dd"
                    @change="dictDateChange"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    v-permission="['ADMIN','REPORT_ALL','REPORT_ACT_BTN_DAILY']"
                    class="filter-item"
                    size="mini"
                    type="success"
                    icon="el-icon-search"
                    @click="toQuery"
                  >搜索
                  </el-button>
                </el-form-item>
                <el-form-item>
                  <el-button
                    class="filter-item"
                    type="primary"
                    size="mini"
                    icon="el-icon-download"
                    @click="exportBtn"
                  >导出
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <el-table
            v-loading="loading"
            :data="data"
            :default-sort="{prop: 'id', order: 'descending'}"
            style="width: 100%"
            @sort-change="tableChange"
          >
            <el-table-column type="index"/>
            <el-table-column
              prop="id"
              label="编号"
              sortable="custom"
            />
            <el-table-column
              prop="ext1"
              label="父模块"
            />
            <el-table-column
              prop="dictLabel"
              label="模块"
            />
            <el-table-column
              prop="dataDate"
              label="日期"
              sortable="custom"
            >
              <template slot-scope="scope">
                <span>{{ dateFormat(new Date(scope.row.dataDate), 'yyyy年MM月dd日') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="pv"
              label="pv"
              sortable="custom"
            />
            <el-table-column
              prop="uv"
              label="uv"
              sortable="custom"
            />
          </el-table>
          <!--分页组件-->
          <el-pagination
            :total="total"
            :current-page="page + 1"
            style="margin-top: 8px;"
            layout="total, prev, pager, next, sizes"
            @size-change="sizeChange"
            @current-change="pageChange"
          />
        </el-tab-pane>
        <el-tab-pane
          v-if="checkPermission(['ADMIN','REPORT_ALL','REPORT_ACT_BTN_DAILY_SUMMARY'])"
          label="汇总按钮点击记录"
          name="btnReportDailySummary"
        >
          <div class="froms">
            <el-form
              ref="form"
              :inline="true"
              label-width="80px"
              size="small"
              class="demo-form-inline"
            >
              <div>
                <el-form-item label="模块">
                  <treeselect
                    :show-count="true"
                    :options="dictTree"
                    :multiple="true"
                    :max-height="150"
                    no-options-text="选项为空"
                    search-nested
                    style="width: 560px;"
                    placeholder="选择模块"
                    @input="dictSelectSummary"
                  />
                </el-form-item>
                <el-form-item>
                  <el-button
                    v-permission="['ADMIN','REPORT_ALL','REPORT_ACT_BTN_DAILY_SUMMARY']"
                    class="filter-item"
                    type="success"
                    icon="el-icon-search"
                    @click="initBtnSummaryPane"
                  >搜索
                  </el-button>
                </el-form-item>
                <el-form-item>
                  <el-button
                    class="filter-item"
                    type="primary"
                    icon="el-icon-download"
                    @click="exportBtnSummary"
                  >导出
                  </el-button>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <el-table
            v-loading="loading"
            :data="data"
            :default-sort="{prop: 'id', order: 'descending'}"
            style="width: 100%"
            @sort-change="tableChangeSummary"
          >
            <el-table-column type="index"/>
            <el-table-column
              prop="id"
              label="编号"
              sortable="custom"
            />
            <el-table-column
              prop="ext1"
              label="父模块"
            />
            <el-table-column
              prop="dictLabel"
              label="模块"
            />
            <el-table-column
              prop="pv"
              label="pv"
              sortable="custom"
            />
            <el-table-column
              prop="uv"
              label="uv"
              sortable="custom"
            />
          </el-table>
          <!--分页组件-->
          <el-pagination
            :total="total"
            :current-page="page + 1"
            style="margin-top: 8px;"
            layout="total, prev, pager, next, sizes"
            @size-change="sizeChange"
            @current-change="pageChange"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import {
  analysisPVUVData,
  number,
  analysisFlopData,
  groupCount,
  analysisLuckyData,
  addGroupNumber,
  addTicketNumber,
  getDictTree,
  getSignUpFormParam,
  getSignUpData,
  getBtnDailyReport,
  getBtnSummary,
  findGoodsByBillboard,
  addTopList,
  findBillboardNum
} from '@/api/report'
import countTo from 'vue-count-to'
import { dateFormat } from '@/utils/formatDate'
import initData from '@/mixins/initData'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { cliTypeOptions, cliTypeStr } from '@/utils/Enums'
import { exportCsv } from '@/utils/export2Csv'

export default {
  components: { countTo, Treeselect },
  mixins: [initData],
  data: function() {
    this.extend = {
      series: {
        label: {
          normal: {
            show: true
          }
        }
      }
    }
    return {
      subMenu: 'pvuv',
      formPVUVInline: [],
      chartPVUVData: {
        columns: ['date', 'pv', 'uv'],
        rows: []
      },
      chartSettings: {
        labelMap: {
          totalNum: '参与人次',
          peopleNum: '去重人数',
          luckyNum: '中奖人次'
        },
        area: true
      },
      tablePVUVData: [],
      groupNumberStart: 0,
      groupNumberEnd: 0,
      extraNumberStart: 0,
      extraNumberEnd: 0,
      totalNumberStart: 0,
      totalNumberEnd: 0,
      peopleNum: '',
      dictTree: [],
      clockCardTableData: [],
      formInline: [],
      chartData: {
        columns: ['date', 'totalNum', 'peopleNum', 'luckyNum'],
        rows: []
      },
      tableData: [],
      tableData1: [],
      form: {
        province: '',
        city: '',
        omsCode: '',
        mallFlag: '',
        grade: null,
        mobile: '',
        time: []
      },
      groupLoading: false,
      pvuvLoading: false,
      dictDate: [],
      numberLoading: false,
      flopLoading: false,
      luckyLoading: false,
      ticketLoading: false,
      btnDailyLoading: false,
      signUpLoading: false,
      gradeOptions: [],
      mallFlagOptions: [
        {
          value: 'true',
          label: '是'
        },
        {
          value: 'false',
          label: '否'
        }
      ],
      signUpTypeOptions: [],
      minPrice: 2000,
      maxPrice: 9000,
      lowMinNumber: 5,
      lowMaxNumber: 9,
      midMinNumber: 2,
      midMaxNumber: 5,
      highMinNumber: 1,
      highMaxNumber: 3,
      min_price: this.minPrice,
      max_price: this.maxPrice,
      signUpForm: {
        name: null,
        mobile: null,
        mallCondition: null,
        type: null,
        cliType: null,
        scene: null,
        startTime: null,
        endTime: null
      },
      cliTypeOptions: cliTypeOptions,
      cliTypeStr: cliTypeStr,
      query: {},
      loading: false,
      viewTime: [],
      // 二级联动
      select1: [
        { value: 'BB001', label: '设计榜单' },
        { value: 'BB002', label: '绿色榜单' },
        { value: 'BB003', label: '智能榜单' }
      ],
      loading: false,
      filters: {
        value1: '',
        value2: ''
      },
      select2: [],
      topListVo: {
        billboardNo: '',
        goodsNo: '',
        billboardNum: ''
      },
      startBillboardNum: ''
    }
  },
  created() {
  },
  mounted: function() {
    var now = new Date()
    var end = new Date(now.getTime() + 3600 * 1000 * 24)
    this.formPVUVInline.push(now)
    this.formPVUVInline.push(end)
    this.formInline.push(now)
    this.formInline.push(end)
    this.form.time.push(now)
    this.form.time.push(end)
    this.dictDate.push(now)
    this.dictDate.push(end)
    this.viewTime.push(now)
    this.viewTime.push(end)
    this.params['dataDateStart'] = this.dictDate
      ? dateFormat(this.dictDate[0], 'yyyy-MM-dd') + ' 00:00:00'
      : ''
    this.params['dataDateEnd'] = this.dictDate
      ? dateFormat(this.dictDate[1], 'yyyy-MM-dd') + ' 23:59:59'
      : ''
  },
  methods: {
    dateFormat,
    checkPermission,
    beforeInit() {
      this.url = 'api/btnDaily'
      const sort = 'id,desc'
      this.params['current'] = this.page + 1
      this.params['size'] = this.size
      this.params['sort'] = sort
      this.params['source'] = this.$route.query.actCode
      return true
    },
    onPVUVSubmit() {
      this.getPVUVRecord(false)
    },
    onPVUVActualSubmit() {
      this.getPVUVRecord(true)
    },
    changePeopleNum() {
      this.numberLoading = true
      addGroupNumber(this.$route.query.actCode, this.peopleNum)
        .then(res => {
          console.log('增加参团人数', res)
          this.$message({
            message: '恭喜你，更新成功',
            type: 'success'
          })
          this.numberLoading = false
          this.extraNumberStart = this.extraNumberEnd
          this.totalNumberStart = this.totalNumberEnd
          this.extraNumberEnd = this.extraNumberEnd + parseInt(this.peopleNum)
          this.totalNumberEnd =
              parseInt(this.groupNumberEnd) + parseInt(this.extraNumberEnd)
          this.$refs.countTo2.start()
          this.$refs.countTo3.start()
        })
        .catch(err => {
          this.numberLoading = false
          console.log(err.response.data.message)
        })
    },
    addTicket() {
      var minPrice = this.minPrice
      var maxPrice = this.maxPrice
      var lowMinNumber = this.lowMinNumber
      var lowMaxNumber = this.lowMaxNumber
      var midMinNumber = this.midMinNumber
      var midMaxNumber = this.midMaxNumber
      var highMinNumber = this.highMinNumber
      var highMaxNumber = this.highMaxNumber
      if (parseInt(minPrice) >= parseInt(maxPrice)) {
        this.$message({
          message: '请输入正确的价格区间，最小价格不能比最高价格高。',
          type: 'error'
        })
        return
      }
      if (
        parseInt(lowMinNumber) > parseInt(lowMaxNumber) ||
          parseInt(midMinNumber) > parseInt(midMaxNumber) ||
          parseInt(highMinNumber) > parseInt(highMaxNumber)
      ) {
        this.$message({
          message: '请输入正确的增长区间，前面的不能比后面的大。',
          type: 'error'
        })
        return
      }
      var obj = {
        minPrice: minPrice,
        maxPrice: maxPrice,
        lowMinNumber: lowMinNumber,
        lowMaxNumber: lowMaxNumber,
        midMinNumber: midMinNumber,
        midMaxNumber: midMaxNumber,
        highMinNumber: highMinNumber,
        highMaxNumber: highMaxNumber
      }
      this.ticketLoading = true
      addTicketNumber(this.$route.query.actCode, obj)
        .then(res => {
          this.ticketLoading = false
          console.log('增加单品券人数', res)
          this.$message({
            message: '恭喜你，更新成功',
            type: 'success'
          })
        })
        .catch(err => {
          this.ticketLoading = false
          console.log(err.message)
        })
    },
    onSubmit() {
      this.getRecord()
    },
    getPVUVRecord(flag) {
      this.pvuvLoading = true
      var obj = {
        source: this.$route.query.actCode,
        startTime: this.formPVUVInline
          ? dateFormat(this.formPVUVInline[0], 'yyyy-MM-dd') + ' 00:00:00'
          : '',
        endTime: this.formPVUVInline
          ? dateFormat(this.formPVUVInline[1], 'yyyy-MM-dd') + ' 23:59:59'
          : '',
        actualFlag: flag
      }
      analysisPVUVData(obj)
        .then(res => {
          this.pvuvLoading = false
          console.log('pvuv', res)
          if (res.dataMap.sourcepvuvvo) {
            this.tablePVUVData = res.dataMap.sourcepvuvvo
            this.chartPVUVData.rows = []
            res.dataMap.sourcepvuvvo.forEach((item, index, array) => {
              if (index > 1) {
                this.chartPVUVData.rows.push(item)
              }
            })
          } else {
            this.tablePVUVData = []
            this.chartPVUVData.rows = []
          }
        })
        .catch(err => {
          this.pvuvLoading = false
          console.log(err.message)
        })
    },
    handleClick(tab, event) {
      this.skipInitFlag = false
      this.page = 0
      this.size = 10
      this.total = 0
      this.data = []
      if (tab.name === 'first') {
        number(this.$route.query.actCode).then(res => {
          console.log('number', res)
          this.groupNumberStart = res.dataMap.groupNumber - 200
          this.groupNumberEnd = res.dataMap.groupNumber
          this.extraNumberStart = 0
          this.extraNumberEnd = res.dataMap.extraNumber
          this.totalNumberStart = res.dataMap.groupNumber - 200
          this.totalNumberEnd = res.dataMap.totalNumber
        }).catch(err => {
          console.log(err.response.data.message)
        })
        this.$refs.countTo1.start()
        this.$refs.countTo2.start()
        this.$refs.countTo3.start()
      } else if (tab.name === 'second') {
        this.min_price = this.minPrice
        this.max_price = this.maxPrice
      } else if (tab.name === 'flopRecord') {
        this.getRecord()
      } else if (tab.name === 'winningRecord') {
        this.getCore()
      } else if (tab.name === 'btnReportDaily') {
        console.log(this.$route.query.actCode, 'this.$route.query.actCode')
        this.getDictTree(this.$route.query.actCode)
        this.init()
      } else if (tab.name === 'btnReportDailySummary') {
        this.getDictTree(this.$route.query.actCode)
        this.initBtnSummaryPane()
      } else if (tab.name === 'clockCard') {
        this.getClockCardData()
      } else if (tab.name === 'signUpRecord') {
        this.page = 10
        this.size = 10
        this.initSignUpPane()
      }
    },
    getRecord() {
      this.flopLoading = true
      var obj = {
        type: 'lucky',
        source: this.$route.query.actCode,
        startTime: this.formInline
          ? dateFormat(this.formInline[0], 'yyyy-MM-dd') + ' 00:00:00'
          : '',
        endTime: this.formInline
          ? dateFormat(this.formInline[1], 'yyyy-MM-dd') + ' 23:59:59'
          : ''
      }
      analysisFlopData(obj)
        .then(res => {
          console.log('抽奖数据', res)
          this.flopLoading = false
          this.tableData = res.dataMap.flopvo
          this.chartData.rows = []
          res.dataMap.flopvo.forEach((item, index, array) => {
            if (index !== 0) {
              this.chartData.rows.push(item)
            }
          })
        })
        .catch(err => {
          this.flopLoading = false
          console.log(err.response.data.message)
        })
    },
    getClockCardData: function() {
      this.groupLoading = true
      groupCount(this.$route.query.actCode)
        .then(res => {
          console.log('团打卡', res)
          this.groupLoading = false
          this.clockCardTableData = res.dataMap.hashmap
        })
        .catch(err => {
          this.groupLoading = false
          console.log(err.response.data.message)
        })
    },
    getCore() {
      var obj = {
        type: 'lucky',
        source: this.$route.query.actCode,
        province: this.form.province,
        city: this.form.city,
        // region:'',
        mallName: this.form.omsCode,
        mallFlag: this.form.mallFlag,
        mobile: this.form.mobile,
        grade: this.form.grade,
        startTime: this.form.time
          ? dateFormat(this.form.time[0], 'yyyy-MM-dd') + ' 00:00:00'
          : '',
        endTime: this.form.time
          ? dateFormat(this.form.time[1], 'yyyy-MM-dd') + ' 23:59:59'
          : ''
      }
      this.gradeOptions = []
      this.luckyLoading = true
      analysisLuckyData(obj)
        .then(res => {
          console.log('中奖记录', res)
          this.tableData1 = res.dataMap.luckydata.list
          this.luckyLoading = false
          res.dataMap.luckydata.gradeMap.forEach((v, index) => {
            var obj = {}
            obj.value = index + 1
            obj.label = v
            this.gradeOptions.push(obj)
          })
        })
        .catch(err => {
          this.luckyLoading = false
          console.log(err.response.data.message)
        })
    },
    setSubmit() {
      this.getCore()
    },
    changePrice() {
      this.min_price = this.minPrice
      this.max_price = this.maxPrice
    },
    getDictTree(source) {
      getDictTree(source).then(res => {
        this.dictTree = []
        this.dictTree = res
        // this.dictTree.push(dictList)
      })
    },
    dictSelect(node, instanceId) {
      let dictIdStr = ''
      node.forEach(v => {
        dictIdStr += v + ','
      })
      this.params['dictIdStr'] = dictIdStr
      console.log('选中了', this.params['dictIdStr'])
    },
    dictSelectSummary(node, instanceId) {
      let dictIdStr = ''
      node.forEach(v => {
        dictIdStr += v + ','
      })
      this.params['dictIdStrSummary'] = dictIdStr
      console.log('选中了', this.params['dictIdStrSummary'])
    },
    dictDateChange() {
      this.params['dataDateStart'] = this.dictDate
        ? dateFormat(this.dictDate[0], 'yyyy-MM-dd') + ' 00:00:00'
        : ''
      this.params['dataDateEnd'] = this.dictDate
        ? dateFormat(this.dictDate[1], 'yyyy-MM-dd') + ' 23:59:59'
        : ''
    },
    initSignUpPane() {
      this.signUpLoading = true
      getSignUpFormParam(this.$route.query.actCode)
        .then(res => {
          this.signUpLoading = false
          this.signUpTypeOptions = res.types
        })
        .catch(err => {
          this.signUpLoading = false
          console.log(err.response.data.message)
        })
    },
    initBtnSummaryPane() {
      console.log('点击了汇总按钮报表')
      this.url = 'api/btnDailySummary'
      this.skipInitFlag = true
      this.params['current'] = 1
      this.params['size'] = this.size
      this.params['source'] = this.$route.query.actCode
      this.toQuery()
    },
    toQuerySignUpData() {
      this.url = 'api/signUpData/' + this.$route.query.actCode
      this.skipInitFlag = true
      this.signUpForm.startTime = this.viewTime
        ? dateFormat(this.viewTime[0], 'yyyy-MM-dd HH:mm:ss')
        : null
      this.signUpForm.endTime = this.viewTime
        ? dateFormat(this.viewTime[1], 'yyyy-MM-dd HH:mm:ss')
        : null
      this.params = this.signUpForm
      this.params['current'] = 1
      this.params['size'] = this.size
      this.toQuery()
    },
    exportBtnSummary() {
      var obj = {
        source: this.$route.query.actCode,
        dictIdStrSummary: this.params['dictIdStrSummary'],
        current: 1,
        size: 99999,
        sortColumnSummary: this.params['sortColumnSummary'],
        isAscSummary: this.params['isAscSummary']
      }
      getBtnSummary(obj)
        .then(res => {
          const fields = [{
            label: '编号',
            value: 'id'
          }, {
            label: '父模块',
            value: 'ext1'
          }, {
            label: '模块',
            value: 'dictLabel'
          }, {
            label: 'PV',
            value: 'pv'
          }, {
            label: 'UV',
            value: 'uv'
          }]
          exportCsv(res.content, fields, '汇总按钮点击报表')
        })
        .catch(err => {
          console.log(err.message)
        })
    },
    exportBtn() {
      const obj = {
        source: this.$route.query.actCode,
        dictIdStr: this.params['dictIdStr'],
        current: 1,
        size: 99999,
        dataDateStart: this.params['dataDateStart'],
        dataDateEnd: this.params['dataDateEnd'],
        sortColumn: this.params['sortColumn'],
        isAsc: this.params['isAsc']
      }
      getBtnDailyReport(obj)
        .then(res => {
          const fields = [{
            label: '编号',
            value: 'id'
          }, {
            label: '父模块',
            value: 'ext1'
          }, {
            label: '模块',
            value: 'dictLabel'
          }, {
            label: '日期',
            value: 'dataDate'
          }, {
            label: 'PV',
            value: 'pv'
          }, {
            label: 'UV',
            value: 'uv'
          }]
          const dateStr = dateFormat(new Date(), 'yyyyMMdd')
          const rows = []
          res.content.forEach(e => {
            const time = dateFormat(new Date(e['dataDate']), 'yyyy-MM-dd')
            e['dataDate'] = time
            rows.push(e)
          })
          exportCsv(rows, fields, '每日按钮点击报表' + dateStr)
        })
        .catch(err => {
          console.log(err.message)
        })
    },
    exportSignUp() {
      var param = this.signUpForm
      param['current'] = 1
      param['size'] = 99999
      getSignUpData(this.$route.query.actCode, param)
        .then(res => {
          const fields = [{
            label: '编号',
            value: 'id'
          }, {
            label: '商场',
            value: 'mallName'
          }, {
            label: '留资页面',
            value: 'type'
          }, {
            label: '时间',
            value: 'updateTime'
          }, {
            label: '环境',
            value: 'cliType'
          }, {
            label: '姓名',
            value: 'name'
          }, {
            label: '手机号',
            value: 'mobile'
          }, {
            label: 'scene',
            value: 'scene'
          }, {
            label: '分享人openid',
            value: 'fromOpenId'
          }, {
            label: '分享人unionid',
            value: 'fromUnionId'
          }]
          const dateStr = dateFormat(new Date(), 'yyyyMMddHHmm')
          const rows = []
          res.content.forEach(e => {
            const cliType = e['cliType'] === 1 ? '微信内' : (e['cliType'] === 2 ? '小程序' : '微信外')
            const time = dateFormat(new Date(e['updateTime']), 'yyyy-MM-dd HH:mm:ss')
            e['cliType'] = cliType
            e['updateTime'] = time
            rows.push(e)
          })
          exportCsv(rows, fields, '留资记录' + dateStr)
        })
        .catch(err => {
          console.log(err.message)
        })
    },
    tableChange(column, prop, order) {
      if (column.prop) {
        this.page = 0
        column.prop = column.prop === 'dataDate' ? 'data_date' : column.prop
        this.params['sortColumn'] = 't.' + column.prop
        this.params['isAsc'] = column.order === 'ascending'
        this.init()
      }
    },
    tableChangeSummary(column, prop, order) {
      console.log(column)
      if (column.prop) {
        this.page = 0
        this.params['sortColumnSummary'] = 't.' + column.prop
        this.params['isAscSummary'] = column.order === 'ascending'
        this.initBtnSummaryPane()
      }
    },
    getRole(prov) {
      console.log(prov)
      var allrole = []
      this.topListVo.billboardNo = prov
      findGoodsByBillboard(this.$route.query.actCode, prov)
        .then(res => {
          allrole = res.dataMap.goodsvo
          this.select2 = allrole
        })
        .catch(err => {
          console.log(err.response.data.message)
        })
    },
    getList(opt) {
      this.topListVo.goodsNo = opt
      console.log('------>>>opt', opt)
      findBillboardNum(this.$route.query.actCode, opt)
        .then(res => {
          this.startBillboardNum = res.dataMap.integer
        })
        .catch(err => {
          console.log(err.response.data.message)
        })
    },
    addTopList(){
      console.log(('----------->>>topListVo', this.topListVo))
      if (this.topListVo.billboardNo !== '' && this.topListVo.goodsNo !== '' && this.topListVo.billboardNum !== '') {
        addTopList(this.$route.query.actCode, this.topListVo)
          .then(res => {
            if (res.code === 200) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            }
          })
          .catch(err => {
            console.log(err.response.data.message)
          })
      } else {
        return '参数为空'
      }
    }
  }
}
</script>

<style scoped>
  .number {
    color: #30b08f;
    margin: 10px 0;
    font-size: 65px;
  }

  .page-container label {
    font-size: 14px;
    color: #5e6d82;
    line-height: 1.5em;
  }

  .page-container b {
    margin-left: 40px;
    font-size: 15px;
    line-height: 1.5em;
  }

  .page-container {
    margin: 10px 5px 10px;
  }
</style>
