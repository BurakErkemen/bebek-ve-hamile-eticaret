import type {
  SliderAdminListItem,
  SliderAdminDetail,
  SliderAdminInput,
  SliderSlideAdminInput,
} from "../entities/slider-admin.entity";

export interface SliderAdminRepository {
  listSliders(): Promise<SliderAdminListItem[]>;
  findSliderById(id: string): Promise<SliderAdminDetail | null>;
  createSlider(input: SliderAdminInput): Promise<{ id: string }>;
  updateSlider(id: string, input: SliderAdminInput): Promise<void>;
  deleteSlider(id: string): Promise<void>;
  createSlide(sliderId: string, input: SliderSlideAdminInput): Promise<{ id: string }>;
  updateSlide(id: string, input: SliderSlideAdminInput): Promise<void>;
  deleteSlide(id: string): Promise<void>;
}
