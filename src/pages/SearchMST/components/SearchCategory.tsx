import NavNetworkLink from "@/components/Navigate";
import { useI18n } from "@/i18n/useI18n";
import { ScrollView, TreeView } from "devextreme-react";
import React from "react";
import InputSearch from "./InputSearch";
import { AdminContentLayout } from "@/packages/layouts/admin-content-layout";

export default function SearchCategory() {
  const { t } = useI18n("SearchMST");

  const selectItem = () => {};
  return (
    <AdminContentLayout className={"SearchMST"}>
      <AdminContentLayout.Slot name={"Header"}>
        <div>Thêm mới</div>
      </AdminContentLayout.Slot>
      <AdminContentLayout.Slot name={"Content"}>
        <InputSearch />
        <div className="w-full">
          <div className="flex mt-[27px] justify-center">
            <ScrollView height={320} showScrollbar="always">
              <div className="mt-[2px]">
                <TreeView
                  id="simple-treeview"
                  items={[
                    {
                      id: "1",
                      text: "Stores",
                      expanded: true,
                      items: [
                        {
                          id: "1_1",
                          text: "Super Mart of the West",
                          expanded: true,
                          items: [
                            {
                              id: "1_1_1",
                              text: "Video Players",
                              items: [
                                {
                                  id: "1_1_1_1",
                                  text: "HD Video Player",
                                  price: 220,
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/1.png",
                                },
                                {
                                  id: "1_1_1_2",
                                  text: "SuperHD Video Player",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/2.png",
                                  price: 270,
                                },
                              ],
                            },
                            {
                              id: "1_1_2",
                              text: "Televisions",
                              expanded: true,
                              items: [
                                {
                                  id: "1_1_2_1",
                                  text: "SuperLCD 42",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/7.png",
                                  price: 1200,
                                },
                                {
                                  id: "1_1_2_2",
                                  text: "SuperLED 42",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/5.png",
                                  price: 1450,
                                },
                                {
                                  id: "1_1_2_3",
                                  text: "SuperLED 50",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/4.png",
                                  price: 1600,
                                },
                                {
                                  id: "1_1_2_4",
                                  text: "SuperLCD 55",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/6.png",
                                  price: 1350,
                                },
                                {
                                  id: "1_1_2_5",
                                  text: "SuperLCD 70",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/9.png",
                                  price: 4000,
                                },
                              ],
                            },
                            {
                              id: "1_1_3",
                              text: "Monitors",
                              expanded: true,
                              items: [
                                {
                                  id: "1_1_3_1",
                                  text: '19"',
                                  expanded: true,
                                  items: [
                                    {
                                      id: "1_1_3_1_1",
                                      text: "DesktopLCD 19",
                                      image:
                                        "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/10.png",
                                      price: 160,
                                    },
                                  ],
                                },
                                {
                                  id: "1_1_3_2",
                                  text: '21"',
                                  items: [
                                    {
                                      id: "1_1_3_2_1",
                                      text: "DesktopLCD 21",
                                      image:
                                        "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/12.png",
                                      price: 170,
                                    },
                                    {
                                      id: "1_1_3_2_2",
                                      text: "DesktopLED 21",
                                      image:
                                        "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/13.png",
                                      price: 175,
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              id: "1_1_4",
                              text: "Projectors",
                              items: [
                                {
                                  id: "1_1_4_1",
                                  text: "Projector Plus",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/14.png",
                                  price: 550,
                                },
                                {
                                  id: "1_1_4_2",
                                  text: "Projector PlusHD",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/15.png",
                                  price: 750,
                                },
                              ],
                            },
                          ],
                        },
                        {
                          id: "1_2",
                          text: "Braeburn",
                          items: [
                            {
                              id: "1_2_1",
                              text: "Video Players",
                              items: [
                                {
                                  id: "1_2_1_1",
                                  text: "HD Video Player",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/1.png",
                                  price: 240,
                                },
                                {
                                  id: "1_2_1_2",
                                  text: "SuperHD Video Player",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/2.png",
                                  price: 300,
                                },
                              ],
                            },
                            {
                              id: "1_2_2",
                              text: "Televisions",
                              items: [
                                {
                                  id: "1_2_2_1",
                                  text: "SuperPlasma 50",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/3.png",
                                  price: 1800,
                                },
                                {
                                  id: "1_2_2_2",
                                  text: "SuperPlasma 65",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/8.png",
                                  price: 3500,
                                },
                              ],
                            },
                            {
                              id: "1_2_3",
                              text: "Monitors",
                              items: [
                                {
                                  id: "1_2_3_1",
                                  text: '19"',
                                  items: [
                                    {
                                      id: "1_2_3_1_1",
                                      text: "DesktopLCD 19",
                                      image:
                                        "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/10.png",
                                      price: 170,
                                    },
                                  ],
                                },
                                {
                                  id: "1_2_3_2",
                                  text: '21"',
                                  items: [
                                    {
                                      id: "1_2_3_2_1",
                                      text: "DesktopLCD 21",
                                      image:
                                        "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/12.png",
                                      price: 180,
                                    },
                                    {
                                      id: "1_2_3_2_2",
                                      text: "DesktopLED 21",
                                      image:
                                        "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/13.png",
                                      price: 190,
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          id: "1_3",
                          text: "E-Mart",
                          items: [
                            {
                              id: "1_3_1",
                              text: "Video Players",
                              items: [
                                {
                                  id: "1_3_1_1",
                                  text: "HD Video Player",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/1.png",
                                  price: 220,
                                },
                                {
                                  id: "1_3_1_2",
                                  text: "SuperHD Video Player",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/2.png",
                                  price: 275,
                                },
                              ],
                            },
                            {
                              id: "1_3_3",
                              text: "Monitors",
                              items: [
                                {
                                  id: "1_3_3_1",
                                  text: '19"',
                                  items: [
                                    {
                                      id: "1_3_3_1_1",
                                      text: "DesktopLCD 19",
                                      image:
                                        "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/10.png",
                                      price: 165,
                                    },
                                  ],
                                },
                                {
                                  id: "1_3_3_2",
                                  text: '21"',
                                  items: [
                                    {
                                      id: "1_3_3_2_1",
                                      text: "DesktopLCD 21",
                                      image:
                                        "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/12.png",
                                      price: 175,
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          id: "1_4",
                          text: "Walters",
                          items: [
                            {
                              id: "1_4_1",
                              text: "Video Players",
                              items: [
                                {
                                  id: "1_4_1_1",
                                  text: "HD Video Player",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/1.png",
                                  price: 210,
                                },
                                {
                                  id: "1_4_1_2",
                                  text: "SuperHD Video Player",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/2.png",
                                  price: 250,
                                },
                              ],
                            },
                            {
                              id: "1_4_2",
                              text: "Televisions",
                              items: [
                                {
                                  id: "1_4_2_1",
                                  text: "SuperLCD 42",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/7.png",
                                  price: 1100,
                                },
                                {
                                  id: "1_4_2_2",
                                  text: "SuperLED 42",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/5.png",
                                  price: 1400,
                                },
                                {
                                  id: "1_4_2_3",
                                  text: "SuperLED 50",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/4.png",
                                  price: 1500,
                                },
                                {
                                  id: "1_4_2_4",
                                  text: "SuperLCD 55",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/6.png",
                                  price: 1300,
                                },
                                {
                                  id: "1_4_2_5",
                                  text: "SuperLCD 70",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/9.png",
                                  price: 4000,
                                },
                                {
                                  id: "1_4_2_6",
                                  text: "SuperPlasma 50",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/3.png",
                                  price: 1700,
                                },
                              ],
                            },
                            {
                              id: "1_4_3",
                              text: "Monitors",
                              items: [
                                {
                                  id: "1_4_3_1",
                                  text: '19"',
                                  items: [
                                    {
                                      id: "1_4_3_1_1",
                                      text: "DesktopLCD 19",
                                      image:
                                        "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/10.png",
                                      price: 160,
                                    },
                                  ],
                                },
                                {
                                  id: "1_4_3_2",
                                  text: '21"',
                                  items: [
                                    {
                                      id: "1_4_3_2_1",
                                      text: "DesktopLCD 21",
                                      image:
                                        "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/12.png",
                                      price: 170,
                                    },
                                    {
                                      id: "1_4_3_2_2",
                                      text: "DesktopLED 21",
                                      image:
                                        "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/13.png",
                                      price: 180,
                                    },
                                  ],
                                },
                              ],
                            },
                            {
                              id: "1_4_4",
                              text: "Projectors",
                              items: [
                                {
                                  id: "1_4_4_1",
                                  text: "Projector Plus",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/14.png",
                                  price: 550,
                                },
                                {
                                  id: "1_4_4_2",
                                  text: "Projector PlusHD",
                                  image:
                                    "https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/products/15.png",
                                  price: 750,
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ]}
                  width={250}
                  onItemClick={selectItem}
                />
              </div>
            </ScrollView>
            <div className="border-l">
              <ScrollView height={320} showScrollbar="always">
                <div>
                  <div className="px-2 hover:bg-[#EAF9F2] cursor-pointer search_history-bg">
                    <div className="w-[740px] border-b m-auto border-[#E3EBF1] py-[16px]">
                      <div className="flex justify-center gap-2 ">
                        <div className="h-[15px]">
                          <img
                            src="/images/icons/lock.png"
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <NavNetworkLink to="/admin/SearchMST/Detail">
                            <div className="text-[14px] w-[711px] search_history-title font-bold line-clamp-2">
                              {t(
                                "Lưu ý quan trọng dành cho doanh nghiệp còn sử dụng hóa đơn giấy. Doanh nghiệp cần lưu ý gì khi chọn Tổ chức cung cấp hóa đơn điện tử? Doanh nghiệp cần lưu ý gì khi chọn Tổ chức cung cấp hóa đơn điện tử chúng tôi cần nhiều thứ"
                              )}
                            </div>
                          </NavNetworkLink>
                          <div className="flex justify-between mt-[12px]">
                            <div>
                              {t("Hỗ trợ hỏi đáp Qinvoice, Hỗ trợ tạo hóa đơn")}
                            </div>
                            <div className="flex items-center">
                              <div className="mr-1">{t(`Cập nhật:`)}</div>
                              <div>05/09/2002</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollView>
            </div>
          </div>
        </div>
      </AdminContentLayout.Slot>
    </AdminContentLayout>
  );
}
